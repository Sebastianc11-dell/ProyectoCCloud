FROM node:18-alpine AS base

ENV NODE_ENV=production
WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

EXPOSE 8080
CMD ["node", "src/server.js"]
