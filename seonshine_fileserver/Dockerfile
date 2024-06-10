FROM node:22.2.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . ./

RUN mkdir -p uploads

EXPOSE 4000

CMD ["node", "server.js"]