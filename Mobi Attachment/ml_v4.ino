//ML
#include <v3-steer_inferencing.h>
#include <Wire.h>
//IMU
#include <MPU9250_asukiaaa.h>
// Display
#include <U8g2lib.h>
// BLE
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
//RAND NUM GEN
#include <iostream>
#include <random>

// === Global Variables ===
MPU9250_asukiaaa imu;
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/U8X8_PIN_NONE);

//BLE
BLEServer *pServer;
BLEService *pService;
BLECharacteristic *pCharacteristic;
bool deviceConnected = false;
#define SERVICE_UUID        "4fafc201-1fb5-459e-8fcc-c5c9c331914b"
#define CHARACTERISTIC_UUID "beb5483e-36e1-4688-b7f5-ea07361b26a8"

// Inference + IMU
#define NUM_AXES 9
float imu_features[EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE];
int sample_index = 0;
float isRepThreshold = 0.7; // need to tune
int repCount = 0;
bool inRest = true;
int timeLeft = 60;

//Rep frequency variables
unsigned long lastRepTime = millis();
float fatigueScore = 50.0;
float lastFatigueScore = 0;

// Declare IMU readings
float ax, ay, az, gx, gy, gz, mx, my, mz;

//FOR GYRO
#define GYRO_REST_THRESHOLD 5.0        // Below this, assume no motion
#define REST_CONFIRMATION_MS 3000      // How long to stay quiet to confirm rest (3 seconds)
#define MOTION_WAKE_THRESHOLD 10.0     // Motion strong enough to exit rest

//EMA FOR Acc data
float baselineAcc =  3.0;
float meanAcc = baselineAcc;
bool prevMotionState = false; // false means not moving

//ARR
#define WINDOW_SIZE 10  // For 1s if sampling at 50Hz
float gyroX[WINDOW_SIZE], gyroY[WINDOW_SIZE], gyroZ[WINDOW_SIZE];
float accX[WINDOW_SIZE], accY[WINDOW_SIZE], accZ[WINDOW_SIZE];
float baselineSD_ACC = 0.0;
float baselineSD_GYRO = 12.4;
bool isCaliberated = false;
bool windowFilled = false;
int gyroIndex = 0;

// BLE Callbacks
class MyServerCallbacks: public BLEServerCallbacks {
    void onConnect(BLEServer* pServer) {
        deviceConnected = true;
        Serial.println("Device connected");
    }

    void onDisconnect(BLEServer* pServer) {
        deviceConnected = false;
        Serial.println("Device disconnected");
        BLEDevice::startAdvertising(); // safer version
    }
    
};


void setup() {
  Serial.begin(115200);
  setupIMU();
  u8g2.begin();
  u8g2.enableUTF8Print();
  setupBLE();
}

void loop() {
  imu.accelUpdate();
  imu.gyroUpdate();
  imu.magUpdate();

  ax = imu.accelX(); ay = imu.accelY(); az = imu.accelZ();
  gx = imu.gyroX();  gy = imu.gyroY();  gz = imu.gyroZ();
  mx = imu.magX();   my = imu.magY();   mz = imu.magZ();

  float gyroMag = sqrt(gx * gx + gy * gy + gz * gz);
  if (gyroMag > 16.0) {
      Serial.println("\nSignificant rotational motion detected. Running inference...");
      if (capture_imu_data()) {
          ei_impulse_result_t result = { 0 };
          signal_t signal;
          signal.total_length = EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE;
          signal.get_data = &raw_feature_get_data;

          EI_IMPULSE_ERROR res = run_classifier(&signal, &result, false);
          Serial.printf("run_classifier returned: %d\n", res);

          print_inference_result(result);
      }
  }


  if (!isCaliberated) {
    caliberateBaseline();
    isCaliberated = true;
  }

  if (isCaliberated) {
    fillWindow();
  }

  inRest = isResting(gyroMag);
  if (inRest && repCount > 0) { // if inRest = true set repCount = 0
      //SEND DATA TO THE MAIN MCU
      repCount = 0;
      timeLeft = 60;
  }
  // meanAcc = updateMeanAcc(motionMagnitude, meanAcc, 0.1);
  float score = 0;
  if (!inRest) {
      score = computeIMUScore(baselineSD_GYRO); // gyro fatigue score
  }
  
  String imuScore = String(score);
  // data im sending out to the main mcu
  // fatigue score for IMU side, min
  if (windowFilled) {
      if (inRest) {
          sendData(imuScore, "1");
      }else {
          sendData(imuScore, "0");
      }
  }

  display();
  delay(1000);

}

void setupIMU() {
    Wire.begin();
    imu.setWire(&Wire);
    imu.beginAccel();
    imu.beginGyro();
    imu.beginMag();
}

bool capture_imu_data() {
    sample_index = 0;

    while (sample_index < EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) {
        imu.accelUpdate(); imu.gyroUpdate(); imu.magUpdate();
        ax = imu.accelX(); ay = imu.accelY(); az = imu.accelZ();
        gx = imu.gyroX();  gy = imu.gyroY();  gz = imu.gyroZ();
        mx = imu.magX();   my = imu.magY();   mz = imu.magZ();

        imu_features[sample_index++] = ax;
        imu_features[sample_index++] = ay;
        imu_features[sample_index++] = az;
        imu_features[sample_index++] = gx;
        imu_features[sample_index++] = gy;
        imu_features[sample_index++] = gz;
        imu_features[sample_index++] = mx;
        imu_features[sample_index++] = my;
        imu_features[sample_index++] = mz;

        delay(43); // ~23Hz sampling
    }

    return true;
}

int raw_feature_get_data(size_t offset, size_t length, float *out_ptr) {
    if ((offset + length) > EI_CLASSIFIER_DSP_INPUT_FRAME_SIZE) return -1;
    memcpy(out_ptr, imu_features + offset, length * sizeof(float));
    return 0;
}

void print_inference_result(ei_impulse_result_t result) {
    for (uint16_t i = 0; i < EI_CLASSIFIER_LABEL_COUNT; i++) {
        if (strcmp(ei_classifier_inferencing_categories[i], "isrep") == 0 &&
            result.classification[i].value > isRepThreshold) {
            Serial.println("Detected repetition!");
            repCount++;
            lastRepTime = millis();
        }
    }
}


void display() {
    static bool showWarning = true;
    static unsigned long lastToggleTime = 0;
    const unsigned long blinkInterval = 500; // ms
    unsigned long now = millis();

    // Toggle blinking text for warning
    if (now - lastToggleTime > blinkInterval) {
        showWarning = !showWarning;
        lastToggleTime = now;
    }

    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB10_tr);

    if (inRest) {
        if (timeLeft > 0) {
            // Show rest countdown
            u8g2.setCursor(0, 20);
            u8g2.print("Rest Time Left:");

            u8g2.setCursor(30, 40);
            u8g2.print(timeLeft);
            u8g2.print(" sec");

            timeLeft--; // Decrease countdown every display cycle
        } else {
            // Show "You can begin!" message
            u8g2.setCursor(0, 30);
            u8g2.print("! You can begin !");  // Will show the second face icon
        }
    } else {
        // Normal workout display
        u8g2.setCursor(0, 12);
        u8g2.print("Reps:");
        u8g2.setCursor(70, 12);
        u8g2.print(repCount);

        u8g2.setCursor(0, 30);
        u8g2.print("Fatigue:");
        u8g2.setCursor(70, 30);
        float score = computeIMUScore(baselineSD_GYRO);
        u8g2.print(score, 1);


        if (score > 40 && showWarning) {
            u8g2.setCursor(0, 50);
            u8g2.print("⚠ Please rest! ⚠");
        }
    }

    u8g2.sendBuffer();
}



void setupBLE() {
    Serial.println("Starting BLE...");
    BLEDevice::init("XIAO_ES");
    pServer = BLEDevice::createServer();
    pServer->setCallbacks(new MyServerCallbacks());
    pService = pServer->createService(SERVICE_UUID);

    pCharacteristic = pService->createCharacteristic(
        CHARACTERISTIC_UUID,
        BLECharacteristic::PROPERTY_READ |
        BLECharacteristic::PROPERTY_WRITE |
        BLECharacteristic::PROPERTY_NOTIFY |
        BLECharacteristic::PROPERTY_INDICATE
    );

    pCharacteristic->addDescriptor(new BLE2902());
    pService->start();

    BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
    pAdvertising->addServiceUUID(SERVICE_UUID);
    pAdvertising->setScanResponse(true);
    pAdvertising->setMinPreferred(0x06);
    BLEDevice::startAdvertising();
    Serial.println("BLE ready. Waiting for client...");
}

void sendData(String data, String isRest) {
    if (deviceConnected && windowFilled) {
        String message = isRest + "," + data + "," + repCount;
        pCharacteristic->setValue(message.c_str());
        pCharacteristic->notify();
        Serial.println("Sent: " + message);
    }
}

//SET DETECTION LOGIC
bool isResting(float magnitude) {
  unsigned long rest_time_threshold = 5000; // 5 seconds

  if (magnitude < GYRO_REST_THRESHOLD) {
    // NO SIGNIFICANT MOTION
    if ((millis() - lastRepTime) > rest_time_threshold) {
      return true;
    }
  } else if (magnitude > MOTION_WAKE_THRESHOLD) {
    lastRepTime = millis();
    if (inRest) {
      Serial.println("New Set Started!");
    }
    inRest = false;
  }
  return false;
}

float getSD(float* arr, int size) {
  float mean = 0.0;
  for (int i = 0; i < size; i++) mean += arr[i];
  mean /= size;
  
  float sd = 0.0;
  for (int i = 0; i < size; i++) sd += (arr[i] - mean) * (arr[i] - mean);
  return sqrt(sd / size);
}


float computeIMUScore(float baselineSD_GYRO) {
  float gyroMag[WINDOW_SIZE];
  for (int i = 0; i < WINDOW_SIZE; i++) {
    gyroMag[i] = sqrt(gyroX[i] * gyroX[i] + gyroY[i] * gyroY[i] + gyroZ[i] * gyroZ[i]);
  }

  float currentSD = getSD(gyroMag, WINDOW_SIZE);
  float instabilityRatio = currentSD / baselineSD_GYRO;
  Serial.println("current " + String(currentSD));
  Serial.println("base " + String(baselineSD_GYRO));
  //Serial.println(instabilityRatio);
  float fatigueScore = constrain(instabilityRatio * 6.0, 0.0, 30.0); // out of 30 points
  return fatigueScore;
}



bool caliberateBaseline() {
    Serial.println("Starting IMU calibration...");

    for (int i = 0; i < WINDOW_SIZE; i++) {
        gyroX[i] = imu.gyroX();
        gyroY[i] = imu.gyroY();
        gyroZ[i] = imu.gyroZ();
        delay(44); // Adjust to match sampling rate (e.g., 50Hz)
    }

    float accelMag[WINDOW_SIZE];
    float gyroMag[WINDOW_SIZE];

    for (int i = 0; i < WINDOW_SIZE; i++) {
        gyroMag[i] = sqrt(gyroX[i]*gyroX[i] + gyroY[i]*gyroY[i] + gyroZ[i]*gyroZ[i]);
        Serial.println(gyroMag[i]);
    }

    //baselineSD_ACC = getSD(accelMag, WINDOW_SIZE);
    //baselineSD_GYRO = getSD(gyroMag, WINDOW_SIZE);
    
    //Serial.println("Baseline SD_ACC: " + String(baselineSD_ACC));
    Serial.println("Baseline SD_GYRO: " + String(baselineSD_GYRO));
    return true;
}

bool fillWindow() {
  gyroX[gyroIndex] = imu.gyroX();
  gyroY[gyroIndex] = imu.gyroY();
  gyroZ[gyroIndex] = imu.gyroZ();
//   accX[gyroIndex] = imu.accX();
//   accY[gyroIndex] = imu.accY();
//   accZ[gyroIndex] = imu.accZ();
  gyroIndex = (gyroIndex + 1) % WINDOW_SIZE;
  Serial.println("Filling window " + String(gyroIndex));
  
  static int samplesCollected = 0;
  if (!windowFilled) {
    samplesCollected++;
  }
  if (samplesCollected >= WINDOW_SIZE) {
    windowFilled = true;
  }

  return windowFilled;
}
