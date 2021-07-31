# Machine analyzer
This is a Raspberry Pi machine vibration analyzer. This set of apps is used to monitor the vibration of a specific device, perform basic analysis on the Pi and feed it to the user via a simple webapp. The Raspbeery and webapp backend are connected to a MQTT broker.

---

## Contents
### Frontend:
ReactJS app that talks to the backend via http. It presents data from the database and the broker to the user.

### Backend:
Simple Express app that saves the data from the broker to the database and exposes endpoints for the frontend. It also is capable of executing basic commands and updating configuration.

### Pi:
Simple python app that captures data from a vibration sensor and processes it extracting basic features based on given configuration.
