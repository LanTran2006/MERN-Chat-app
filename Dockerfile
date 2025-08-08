# Install dependencies
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy files
COPY package*.json ./
COPY tsconfig.json ./

# Install deps
RUN npm install

# Copy the rest
COPY . .

# Build Next.js app (optional for production)
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev"]
