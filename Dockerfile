FROM node:16-slim

WORKDIR /app

ADD package.json package.json

RUN npm install -g serve

RUN npm install -g express && npm install helmet && npm install

COPY . ./

RUN npm run build

CMD ["npx", "serve", "dist/", "--single"]