FROM node:20-slim

RUN apt-get update && apt-get install -y bash && rm -rf /var/lib/apt/lists/*
RUN npm install -g expo-cli @expo/ngrok

WORKDIR /app/project
COPY templates/expo-minimal/ .
RUN npm install

WORKDIR /app/server
COPY apps/preview/package.json .
COPY apps/preview/server.js .
RUN npm install

COPY apps/preview/start.sh /app/start.sh
RUN chmod +x /app/start.sh

ENV CI=1

EXPOSE 3100 8081

CMD ["/app/start.sh"]
