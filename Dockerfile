# To build the image:   docker build -t pique-visualizer-dev .
# To run the container: docker run -p 5173:5173 pique-visualizer-dev
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
EXPOSE 5173

# Start the app in development mode
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"] 