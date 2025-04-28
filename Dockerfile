#── Stage 1: build the app
FROM node:22-alpine AS builder
WORKDIR /src

# Install all deps (including dev for TS build)
COPY package*.json ./
RUN npm ci

# Copy source & produce JS
COPY . .
RUN npm run build

#── Stage 2: runtime image
FROM node:22-alpine AS runtime
WORKDIR /src

# Install only production deps
COPY package*.json ./
RUN npm ci --production

# Copy built output
COPY --from=builder /src/dist ./dist

# Expose your PORT
EXPOSE 3100

# Start the server
CMD ["node", "dist/index.js"]
