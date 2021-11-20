FROM node:14.17.4-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install
RUN npm install react-scripts@3.4.1 -g

COPY public/ public/
COPY src/ src/
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
ARG BACKEND_URL http://analyzer-backend:4200
ENV REACT_APP_BACKEND_URL=$BACKEND_URL
CMD ["nginx", "-g", "daemon off;"]