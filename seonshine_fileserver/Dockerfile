FROM node:14

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./
EXPOSE 4000

CMD ["node", "server.js"]