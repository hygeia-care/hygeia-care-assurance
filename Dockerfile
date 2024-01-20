FROM node:16-alpine

WORKDIR /app

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY bin/ ./bin
COPY public ./public
COPY routes/ ./routes
COPY models/ ./models
COPY services/ ./services
COPY app.js .
COPY db.js .
COPY dbTests.js .
COPY verifyJWTToken.js .
COPY .env .

EXPOSE 3338

CMD npm start