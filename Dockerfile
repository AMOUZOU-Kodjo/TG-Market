FROM node:22-alpine AS base

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3000

CMD ["node", "src/index.js"]
