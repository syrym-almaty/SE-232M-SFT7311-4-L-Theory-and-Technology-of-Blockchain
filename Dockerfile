# frontend/Dockerfile
FROM node:14

# Set working directory inside the container
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose the port for the frontend app (React)
EXPOSE 3001

# Start the React app
CMD ["npm", "start"]
