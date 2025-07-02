# 🏋️‍♂️ Mobi – Smart Strength Training for Seniors

**Mobi** is a smart, low-cost, machine learning–powered solution designed to bring safe, accessible strength training to seniors through real-time exercise tracking and fatigue monitoring. Built for Active Ageing Centres (AACs) and public fitness corners, Mobi enables seniors to train safely while families and caregivers stay connected through shared dashboards.

---

## 🚀 Features

- 📊 **Real-time Repetition Detection** using IMU (gyro-based) motion data  
- ❤️ **Fatigue Scoring** via heart rate and gyroscope integration  
- 🧠 **Edge ML** inference for low-latency, on-device decision-making  
- 👨‍👩‍👧‍👦 **Caregiver & Family Dashboards** for remote monitoring  
- 🧓 **Gamified Engagement** via leaderboard and "Jio Me" social challenges  
- 🏃‍♂️ **Exercise Corner Compatibility** for decentralized, scalable deployment

---

## 📦 Tech Stack

- **MCU**: Seeed Studio XIAO ESP32S3  
- **Sensor Modules**: Grove 9DoF IMU, MAX30102 heart rate sensor  
- **ML Model**: Edge Impulse motion classification  
- **Frontend**: React.js MVP (see `/app`)  
- **Cloud**: Supabase 

---

## ⚠️ Disclaimer

> **Mobi was created as part of the UTC2738 Steer Shenzhen 2025 program: “Pitches to Prototypes.”**  
> This repository contains an early-stage MVP, built in **under 2 days**, showcasing **rapid prototyping** and **agile development practices**.  
> It is **not production-ready**, but demonstrates the system architecture and core logic behind real-time repetition and fatigue monitoring for seniors.

---

## 📚 Getting Started

1. **Clone the repo**  
   ```bash
   git clone https://github.com/your-username/mobi-fitness-app.git
   cd mobi-fitness-app
   

