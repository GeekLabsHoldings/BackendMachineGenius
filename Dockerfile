FROM ghcr.io/puppeteer/puppeteer:16.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable \
    SQLITE_DB_PATH=/usr/src/app/DataBase/DataBases.sqlite

WORKDIR /usr/src/app
COPY package*json ./
RUN npm ci
COPY . .
RUN mkdir -p /usr/src/app/DataBase
RUN chown -R node:node /usr/src/app/DataBase

USER node

CMD [ "node", "main.js"]
