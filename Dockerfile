FROM node:18.16.0

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9006

CMD ["npm", "start"]