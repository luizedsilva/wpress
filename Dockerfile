FROM node:alpine
WORKDIR /app
COPY package*.json ./
COPY .env ./
RUN npm install
COPY . . 
EXPOSE 8080