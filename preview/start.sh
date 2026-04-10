#!/bin/sh
export CI=1
cd /app/server && node server.js &
cd /app/project
npx expo start --tunnel 2>&1 | while IFS= read -r line; do
  echo "$line"
  echo "$line" >> /tmp/expo-logs.txt
done
