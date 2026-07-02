FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN apk add --no-cache docker-cli && npm ci --omit=dev

COPY src ./src

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npm", "start"]
