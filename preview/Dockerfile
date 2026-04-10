FROM node:20-slim

RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*
RUN npm install -g expo-cli @expo/ngrok

WORKDIR /app/project
COPY template/ .
RUN npm install

WORKDIR /app/server
COPY preview/package.json .
COPY preview/server.js .
RUN npm install

COPY preview/start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV CI=1

EXPOSE 3100 8081

CMD ["/app/start.sh"]
