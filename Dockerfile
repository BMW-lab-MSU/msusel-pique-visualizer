# To build the image:   docker build -t pique-tuner-dev .
# To run the container: docker run -p 5174:5174 pique-tuner-dev
# Use official Node.js LTS image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Expose Vite dev server port
EXPOSE 5174

# Start the app in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 