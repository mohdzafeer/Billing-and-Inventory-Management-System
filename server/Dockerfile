FROM node:24

WORKDIR /server

COPY server.js .
COPY package.json .

RUN npm install

EXPOSE 3000

CMD ["node","server.js"]