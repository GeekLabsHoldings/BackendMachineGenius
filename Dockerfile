FROM ghcr.io/puppeteer/puppeteer:16.1.0

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome-stable

# Create a non-root user
RUN useradd -ms /bin/sh appuser

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./
RUN npm ci

# Copy the rest of the application code
COPY . .

# Ensure directory ownership is correct
RUN chown -R appuser:appuser /usr/src/app

USER appuser

# Ensure the log file and its directory exist and have correct permissions
RUN mkdir -p /usr/src/app && touch /usr/src/app/app.log && chmod 666 /usr/src/app/app.log

CMD [ "node", "main.js" ]
