FROM node:19.8.1

WORKDIR /frontend

COPY . .

RUN npm install --legacy-peer-deps

EXPOSE 3000

CMD ["npm", "start"]