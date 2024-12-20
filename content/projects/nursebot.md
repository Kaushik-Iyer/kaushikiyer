---
title: "NurseBot: Healthcare Automation System"
date: 2023-05-01T00:00:00-05:00
draft: false
description: "An autonomous robotic system designed to assist healthcare workers by monitoring patient vitals and delivering medications using line-following technology and IoT integration."
technologies:
  - Arduino
  - NodeMCU (ESP8266)
  - IoT
  - Blynk Platform
  - Sensors
  - Robotics
github: ""
type: "projects"
image: "images/nursebot.png"
---
Developed an innovative healthcare automation system combining robotics and IoT to assist medical staff in routine patient care tasks. The project integrated multiple technologies to create a comprehensive solution for patient monitoring and medication delivery. It is a line following robot, which successfully navigates across '+' junctions, performs a U-turn at the end and starts sensory activity when the finger is placed. The value is updated immediately on the Blynk app's displays, and then the robot automatically follows the same path back to the starting position.

##### Technical Components

- Built a line-following robot using Arduino Uno with four IR sensors for hospital navigation
- Integrated a 3-DOF robotic arm controlled by NodeMCU for medication transport
- Implemented vital sign monitoring using MAX30105 (pulse) and MLX90614 (temperature) sensors
- Developed mobile interface using Blynk platform for remote monitoring and control
- Established UART and I2C communication between components

##### Key Features

- Autonomous navigation through hospital wards
- Real-time vital sign monitoring and data transmission
- Remote control through mobile application
- Automated medication delivery system
- WiFi-enabled data transmission

This project took us more time than expected, since I had no prior experience in working with Arduino, or building robots from scratch, and the other group members also were assigned unfamiliar tasks. But it was a very fruitful experience, especially in the end when we saw the whole bot perform end-to-end operations.