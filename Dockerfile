# Build stage
FROM node:18 as build

# Set working directory
WORKDIR /build

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY rpg.toml ./

# Install dependencies
RUN npm ci

# Copy source files
COPY . .

# Build the application
ENV NODE_ENV=production
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /game

# Copy built assets and necessary files
COPY --from=build /build/dist ./dist
COPY --from=build /build/package*.json ./
COPY --from=build /build/rpg.toml ./

# Install production dependencies only
ENV NODE_ENV=production
RUN npm ci --only=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"]