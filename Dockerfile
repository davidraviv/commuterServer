# From latest node lts
FROM node:20-slim

WORKDIR /usr/src/app

# Copy all the files from your file system to the container file system
COPY package*.json .
# Install all dependencies
RUN npm clean-install

# Copy other files as well
COPY . .

# Expose the port
EXPOSE 5500

# Command to execute when the image is instantiated
CMD ["npm", "start"]
