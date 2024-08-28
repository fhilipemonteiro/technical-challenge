FROM node:20.17.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 80

CMD ["npm", "run", "start"]