# Machine analyzer GUI backend
Simple Express app that saves the data from the analyzer to the database and exposes endpoints for the frontend.

Required environment variables (in a .env file):
PORT - application port (should be 4200)
FRONTEND_ORIGIN - frontend app url
DB_URL - mongodb connection url
DB_USER - mongodb user
DB_PASSWORD - mongodb password
MQTT_URL - mqtt broker url
MQTT_PORT - mqtt broker port
MQTT_USER - mqtt broker user
MQTT_PASSWORD - mqtt broker password
PYTHON_PATH - python executable with numpy and scipy packages
