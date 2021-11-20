FROM node:14.17.4

WORKDIR /usr/src/app

# install node dependencies
COPY package*.json ./
RUN npm install
COPY src/ src/

# install python3
RUN apt-get -y update && apt-get -y upgrade
RUN apt-get install python3 python3-pip -y
RUN python3 -m pip install numpy
RUN python3 -m pip install scipy

# environment
ARG PORT 4200
ARG FRONTEND_ORIGIN
ARG DB_URL
ARG DB_USER
ARG DB_PASSWORD
ARG MQTT_URL
ARG MQTT_PORT
ARG MQTT_USER
ARG MQTT_PASSWORD
ARG PYTHON_PATH python3

ENV PORT $PORT
ENV FRONTEND_ORIGIN $FRONTEND_ORIGIN
ENV DB_URL $DB_URL
ENV DB_USER $DB_USER
ENV DB_PASSWORD $DB_PASSWORD
ENV MQTT_URL $MQTT_URL
ENV MQTT_PORT $MQTT_PORT
ENV MQTT_USER $MQTT_USER
ENV MQTT_PASSWORD $MQTT_PASSWORD
ENV PYTHON_PATH $PYTHON_PATH

CMD ["node", "src/server.js"]