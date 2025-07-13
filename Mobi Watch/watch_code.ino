#include <Arduino.h>
#include <WiFi.h>
#include <time.h>
#include <ESP_Google_Sheet_Client.h>
#include <BLEDevice.h>
#include <BLEUtils.h>
#include <BLEScan.h>
#include <BLEAdvertisedDevice.h>
#include <U8g2lib.h>

// Wi-Fi credentials
#define WIFI_SSID "enter_your_wifi_ssid"
#define WIFI_PASSWORD "enter_your_wifi_password"
U8G2_SSD1306_128X64_NONAME_F_HW_I2C u8g2(U8G2_R0, /* reset=*/U8X8_PIN_NONE);

// Google Sheets configuration
#define PROJECT_ID "example-project-id" // Replace with your Google Cloud project ID
#define CLIENT_EMAIL "enter_your_service_account_email" // Replace with your service account email
const char PRIVATE_KEY[] PROGMEM = "-----BEGIN PRIVATE KEY-----\n"
const char spreadsheetId[] = "enter_your_spreadsheet_id"; // Replace with your Google Sheets ID

// BLE configuration
#define SERVICE_UUID        "endpoint-uuid-1234-5678-90ab-cdef12345678" // Replace with your BLE service UUID
#define CHARACTERISTIC_UUID "endpoint-characteristic-uuid-1234-5678-90ab-cdef12345678" // Replace with your BLE characteristic UUID
static BLEAddress *pServerAddress = nullptr;
static boolean doConnect = false;
static boolean connected = false;
static boolean bleDisconnected = false;
static BLERemoteCharacteristic* pRemoteCharacteristic;

// Display time handling
unsigned long lastTimeUpdate = 0;
const unsigned long restTimeInterval = 1000; // 1s interval

// Data handling
unsigned long lastValueTime = 0;
const int COLLECTION_TIMEOUT = 5000; // 5 seconds timeout
int timeLeft = 60;
bool newSetStarted = false;

// System states
enum SystemState { 
  STATE_BLE_SCANNING, 
  STATE_BLE_CONNECTED, 
  STATE_WIFI_CONNECTING, 
  STATE_GSHEET_UPLOADING 
};
SystemState currentState = STATE_BLE_SCANNING;

// Wi-Fi connection timeout
const unsigned long WIFI_TIMEOUT = 10000; // 10 seconds
unsigned long wifiStartTime = 0;

// Google Sheets client
bool gsheetReady = false;
unsigned long gsheetStartTime = 0;
const unsigned long GSHEET_TIMEOUT = 30000; // 30 seconds timeout

// Heart Rate variables
float currentHeartRate = 0.0;
float meanHR = 70.0;
float imuFatigue = 0;
const float alpha = 0.1;
const float baselineHR = 70.0;

// Heart Rate calculation variables
const byte RATE_ARRAY_SIZE = 4; // Increase for more averaging
long rateArray[RATE_ARRAY_SIZE]; // Array of heart rates
byte ratePointer = 0;
long lastBeat = 0;
int beatsPerMinute = 0;
bool fingerDetected = false;

int collecting = 0;
int reps = 0;
int inRest = 1;
int fatigueState = 0;
int setCount = 0;

// Read heart rate from MAX30102 sensor
float getHeartRate() {
    long irValue = particleSensor.getIR();
    
    if (checkForBeat(irValue)) {
        fingerDetected = true;
        
        // Calculate time between beats
        long delta = millis() - lastBeat;
        lastBeat = millis();

        // Store valid heart rate in array
        if (delta > 300 && delta < 3000) { // Valid heart rate range (20-200 BPM)
            rateArray[ratePointer++] = (60000 / delta); // Convert to BPM
            ratePointer %= RATE_ARRAY_SIZE;

            // Calculate average of readings
            long total = 0;
            for (byte i = 0; i < RATE_ARRAY_SIZE; i++) {
                total += rateArray[i];
            }
            beatsPerMinute = total / RATE_ARRAY_SIZE;
            
            currentHeartRate = (float)beatsPerMinute;
        }
    } else {
        // No finger detected or invalid reading
        fingerDetected = (irValue > 50000); // Threshold for finger detection
    }
    
    // Return current heart rate or baseline if no valid reading
    return fingerDetected && currentHeartRate > 30 ? currentHeartRate : baselineHR;
}

// Data storage for sessions
struct SessionData {
  float meanHR;
  int repCount;
  unsigned long timestamp;
  float fatigue;
  int fatigueState;
  int setNumber;
};
#define MAX_SESSIONS 10
SessionData sessions[MAX_SESSIONS];
int sessionCount = 0;

// EMA update functions
float updateMeanHR(float newValue, float prevEMA, float alpha) {
  return alpha * newValue + (1 - alpha) * prevEMA;
}

// Fatigue score calculations
float HRFatigueScore() {
  return (meanHR/(220- 75)) * 70;
}

// Display function
void display() {
    static bool showWarning = true;
    static unsigned long lastToggleTime = 0;
    const unsigned long blinkInterval = 500; // ms
    unsigned long now = millis();
    float currentFatigue = imuFatigue + HRFatigueScore();

    // Toggle blinking text for warning
    if (now - lastToggleTime > blinkInterval) {
        showWarning = !showWarning;
        lastToggleTime = now;
    }

    u8g2.clearBuffer();
    u8g2.setFont(u8g2_font_ncenB10_tr);

    if (inRest) {
        // Only update rest timer once per second
        if (timeLeft > 0 && (now - lastTimeUpdate >= restTimeInterval)) {
            timeLeft--;
            lastTimeUpdate = now;
        }
        
        if (timeLeft > 0) {
            u8g2.setCursor(0, 20);
            u8g2.print("Rest Time Left:");
            u8g2.setCursor(30, 40);
            u8g2.print(timeLeft);
            u8g2.print(" sec");
        } else {
            u8g2.setCursor(0, 30);
            u8g2.print("! You can begin !");
        }
       
        u8g2.setCursor(0, 60);
        u8g2.print("HR: ");
        u8g2.print((int)currentHeartRate);
        if (!fingerDetected) {
            u8g2.print(" --");
        }
    } else {
        u8g2.setCursor(0, 12);
        u8g2.print("Reps:");
        u8g2.setCursor(70, 12);
        u8g2.print(reps);

        u8g2.setCursor(0, 30);
        u8g2.print("Fatigue:");
        u8g2.setCursor(70, 30);
        u8g2.print(currentFatigue, 1);
        
        u8g2.setCursor(0, 48);
        u8g2.print("HR:");
        u8g2.setCursor(35, 48);
        u8g2.print((int)currentHeartRate);
        if (!fingerDetected) {
            u8g2.print(" --");
        }

        u8g2.setCursor(70, 48);
        u8g2.print("Set:");
        u8g2.setCursor(105, 48);
        u8g2.print(setCount);

        if (currentFatigue > 85 && showWarning) {
            u8g2.setCursor(0, 60);
            u8g2.print("⚠ Please rest! ⚠");
            fatigueState = 1;
        }
    }

    u8g2.sendBuffer();
}

// BLE Client Callbacks
class MyClientCallback : public BLEClientCallbacks {
  void onConnect(BLEClient* pclient) {
    connected = true;
    bleDisconnected = false;
    Serial.println("Connected to BLE server");
  }

  void onDisconnect(BLEClient* pclient) {
    connected = false;
    bleDisconnected = true;
    Serial.println("Disconnected from BLE server");
  }
};

// BLE Advertised Device Callbacks
class MyAdvertisedDeviceCallbacks: public BLEAdvertisedDeviceCallbacks {
  void onResult(BLEAdvertisedDevice advertisedDevice) {
    if (advertisedDevice.haveServiceUUID() && advertisedDevice.getServiceUUID().equals(BLEUUID(SERVICE_UUID))) {
      Serial.println("Found target BLE device");
      advertisedDevice.getScan()->stop();
      pServerAddress = new BLEAddress(advertisedDevice.getAddress());
      doConnect = true;
    }
  }
};

// BLE Notification Callback
static void notifyCallback(BLERemoteCharacteristic* pBLERemoteCharacteristic, 
                          uint8_t* pData, 
                          size_t length, 
                          bool isNotify) {
  String receivedData = String((char*)pData, length);
  Serial.println("Received BLE Data: " + receivedData);
  
  // Parse the received data (format: "booleanVal,floatingPointVal,repCount")
  int firstComma = receivedData.indexOf(',');
  int secondComma = receivedData.indexOf(',', firstComma + 1);
  
  if (firstComma == -1 || secondComma == -1) {
    Serial.println("Invalid data format");
    return;
  }
  
  String boolStr = receivedData.substring(0, firstComma);
  String valueStr = receivedData.substring(firstComma + 1, secondComma);
  String repCountStr = receivedData.substring(secondComma + 1);
  
  int boolFlag = boolStr.toInt();
  imuFatigue = valueStr.toFloat();
  reps = repCountStr.toInt();

  if (boolFlag == 0) {  // Workout session started
    inRest = 0;
    collecting = 1;
    
    // Only reset for a new set, not for each rep
    if (newSetStarted) {
      timeLeft = 60;
      meanHR = baselineHR;
      fatigueState = 0;
      newSetStarted = false;
      setCount++;
      Serial.println("New set started");
    }
  } else {  // Workout session ended
    inRest = 1;
    collecting = 0;
    newSetStarted = true;  // Prepare for next set
    Serial.println("Set ended");
    
    // Store session data only when a set completes
    if (sessionCount < MAX_SESSIONS) {
      sessions[sessionCount].meanHR = meanHR;
      sessions[sessionCount].repCount = reps;
      sessions[sessionCount].timestamp = time(nullptr);
      sessions[sessionCount].fatigue = imuFatigue + HRFatigueScore();
      sessions[sessionCount].fatigueState = fatigueState;
      sessions[sessionCount].setNumber = setCount;
      sessionCount++;
      Serial.println("Session data stored for set " + String(setCount));
    }
  }
  
  lastValueTime = millis();
}

// Connect to BLE Server
bool connectToServer() {
  BLEClient* pClient = BLEDevice::createClient();
  pClient->setClientCallbacks(new MyClientCallback());
  
  if (!pClient->connect(*pServerAddress)) {
    Serial.println("BLE connection failed");
    return false;
  }

  BLERemoteService* pRemoteService = pClient->getService(SERVICE_UUID);
  if (!pRemoteService) {
    Serial.println("Service not found");
    return false;
  }

  pRemoteCharacteristic = pRemoteService->getCharacteristic(CHARACTERISTIC_UUID);
  if (!pRemoteCharacteristic) {
    Serial.println("Characteristic not found");
    return false;
  }

  if(pRemoteCharacteristic->canNotify()) {
    pRemoteCharacteristic->registerForNotify(notifyCallback);
  }

  return true;
}

// Upload session data to Google Sheets (Sheet3)
void uploadDataToSheets() {
  if (sessionCount == 0) return;

  FirebaseJson response;
  FirebaseJson valueRange;
  valueRange.add("majorDimension", "ROWS");

  FirebaseJsonArray rows;
  for (int i = 0; i < sessionCount; i++) {
    FirebaseJsonArray row;
    row.add(sessions[i].timestamp);    // Column A: Timestamp
    row.add(sessions[i].fatigue);      // Column B: Fatigue
    row.add(sessions[i].meanHR);       // Column C: MeanHR
    row.add(sessions[i].repCount);     // Column D: Rep Count
    row.add(sessions[i].fatigueState); // Column E: Fatigue State
    row.add(sessions[i].setNumber);    // Column F: Set Number
    rows.add(row);
  }

  valueRange.add("values", rows);

  // Upload to Sheet3
  if (GSheet.values.append(&response, spreadsheetId, "Sheet3!A2", &valueRange)) {
    Serial.println("Data uploaded to Google Sheets");
    sessionCount = 0;  // Clear stored sessions after upload
  } else {
    Serial.println("Google Sheets upload failed: " + String(GSheet.errorReason()));
  }
}

void setup() {
  Serial.begin(115200);
  u8g2.begin();
  u8g2.clearBuffer();
  u8g2.setFont(u8g2_font_ncenB10_tr);
  u8g2.drawStr(0, 20, "Starting...");
  u8g2.sendBuffer();
  
  // Initialize MAX30102 sensor
  if (!particleSensor.begin()) {
    Serial.println("MAX30102 was not found. Please check wiring/power.");
    u8g2.clearBuffer();
    u8g2.drawStr(0, 20, "HR Sensor Error!");
    u8g2.sendBuffer();
    while(1);
  }
  
  // Configure MAX30102 sensor
  particleSensor.setup(); // Configure sensor with default settings
  particleSensor.setPulseAmplitudeRed(0x0A); // Turn Red LED to low to indicate sensor is running
  particleSensor.setPulseAmplitudeGreen(0); // Turn off Green LED
  
  Serial.println("MAX30102 Heart Rate Sensor initialized");
  
  // Initialize BLE scanning
  Serial.println("Starting BLE scanning...");
  BLEDevice::init("ESP32_BLE_Client");
  BLEScan* pBLEScan = BLEDevice::getScan();
  pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
  pBLEScan->setActiveScan(true);
  pBLEScan->start(30);
}

void loop() {
  static unsigned long lastHRUpdate = 0;
  const unsigned long hrUpdateInterval = 100; // Update HR every 100ms for responsiveness
  
  display();

  // Update heart rate continuously
  if (millis() - lastHRUpdate >= hrUpdateInterval) {
    currentHeartRate = getHeartRate();
    
    // Update mean heart rate during workout sessions
    if (connected && collecting) {
      meanHR = updateMeanHR(currentHeartRate, meanHR, alpha);
    }
    
    lastHRUpdate = millis();
  }

  switch (currentState) {
    case STATE_BLE_SCANNING:
      if (doConnect) {
        if (connectToServer()) {
          currentState = STATE_BLE_CONNECTED;
          Serial.println("BLE Connected");
          newSetStarted = true;  // Prepare for first set
          setCount = 0;          // Reset set counter
        } else {
          Serial.println("Failed to connect to BLE server");
          currentState = STATE_BLE_SCANNING;
        }
        doConnect = false;
      } else {
        // Restart BLE scan if no device found
        static unsigned long lastScan = 0;
        if (millis() - lastScan > 10000) {
          Serial.println("Restarting BLE scan...");
          BLEScan* pBLEScan = BLEDevice::getScan();
          pBLEScan->start(30);
          lastScan = millis();
        }
      }
      break;

    case STATE_BLE_CONNECTED:
      if (bleDisconnected) {
        Serial.println("BLE disconnected, moving to WiFi");
        BLEDevice::deinit();
        currentState = STATE_WIFI_CONNECTING;
        WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
        wifiStartTime = millis();
        bleDisconnected = false;
      }
      break;

    case STATE_WIFI_CONNECTING:
      if (WiFi.status() == WL_CONNECTED) {
        Serial.println("WiFi connected!");
        configTime(0, 0, "pool.ntp.org");  // Configure NTP
        currentState = STATE_GSHEET_UPLOADING;
        gsheetStartTime = millis();
      } 
      else if (millis() - wifiStartTime > WIFI_TIMEOUT) {
        Serial.println("WiFi connection failed, returning to BLE scanning");
        BLEDevice::init("ESP32_BLE_Client");
        BLEScan* pBLEScan = BLEDevice::getScan();
        pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
        pBLEScan->setActiveScan(true);
        pBLEScan->start(30);
        currentState = STATE_BLE_SCANNING;
      }
      break;

    case STATE_GSHEET_UPLOADING:
      if (!GSheet.ready()) {
        // Initialize Google Sheets client if not already done
        if (!gsheetReady) {
          Serial.println("Initializing Google Sheets client...");
          GSheet.begin(CLIENT_EMAIL, PROJECT_ID, PRIVATE_KEY);
          gsheetReady = true;
        }
        
        // Check if timeout reached
        if (millis() - gsheetStartTime > GSHEET_TIMEOUT) {
          Serial.println("Google Sheets client timeout, returning to BLE scanning");
          gsheetReady = false;
          currentState = STATE_BLE_SCANNING;
        }
        break;
      }
      
      // Client is ready, upload data
      uploadDataToSheets();
      gsheetReady = false;
      
      // Return to BLE scanning
      Serial.println("Returning to BLE scanning");
      BLEDevice::init("ESP32_BLE_Client");
      BLEScan* pBLEScan = BLEDevice::getScan();
      pBLEScan->setAdvertisedDeviceCallbacks(new MyAdvertisedDeviceCallbacks());
      pBLEScan->setActiveScan(true);
      pBLEScan->start(30);
      currentState = STATE_BLE_SCANNING;
      break;
  }

  delay(50); 
}