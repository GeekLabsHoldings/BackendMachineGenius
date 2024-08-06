FROM node:18-slim

# Install dependencies for Puppeteer
RUN apt-get update && apt-get install -y wget gnupg && \
    wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    sh -c 'echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && apt-get install -y google-chrome-stable --no-install-recommends && \
    apt-get purge --auto-remove -y && apt-get clean && rm -rf /var/lib/apt/lists/*

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    SQLITE_DB_PATH=/usr/src/app/DataBase/DataBases.sqlite

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .

EXPOSE 3000 

CMD [ "node", "main.js" ]
