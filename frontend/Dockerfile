# Use the official Node.js image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend application
COPY . .

ENV NODE_OPTIONS="--openssl-legacy-provider"

# Build the production-ready React app
RUN npm run build

# Install a simple web server to serve the build files (e.g., serve)
RUN npm install -g serve

# Expose the port for the frontend
EXPOSE 5173

# Command to serve the app
CMD ["serve", "-s", "build", "-l", "5173"]
