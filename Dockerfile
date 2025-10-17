# Use the latest LTS version of Node.js
FROM node:22-alpine

# Set working directory
WORKDIR /src

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Accept build argument for API URL
ARG VITE_API_BASE_URL=http://localhost:8080/
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

# Expose Vite's default port
EXPOSE 8080

# Start the development server
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "8080"]