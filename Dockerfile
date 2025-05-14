FROM node:22-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 3000

ENV NODE_ENV=production

RUN ulimit -c unlimited

ENTRYPOINT ["npm", "run", "serve"]
