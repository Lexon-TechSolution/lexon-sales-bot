FROM ghcr.io/puppeteer/puppeteer:latest

USER root

# Hakikisha folder la app lina ruhusa sahihi
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Hii inaiambia bot wapi Chrome ilipo kwenye hii image mahususi
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/google-chrome

CMD ["node", "index.js"]
