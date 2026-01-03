# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (for Docker cache)
COPY package*.json ./

# Install dependencies
#RUN npm install --production
RUN npm install

# Copy app source code
COPY . .

# Expose app port
EXPOSE 3000

# Start the app
CMD ["node", "index.js"]