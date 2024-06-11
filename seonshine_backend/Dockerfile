FROM node:22.2.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . ./

EXPOSE 5050

CMD ["node", "server.js"]
