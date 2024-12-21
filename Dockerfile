FROM node:18-alpine

WORKDIR /

# Install TypeScript and ts-node globally
RUN npm install -g typescript ts-node

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy TypeScript config and source code
COPY tsconfig.json ./
COPY . .

# Expose your port (adjust if needed)
EXPOSE 8080

# Start command for development
CMD ["npm", "run", "dev"]