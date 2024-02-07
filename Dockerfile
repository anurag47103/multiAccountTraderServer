# Use the official Node.js 16 image as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Use the build script from package.json to compile TypeScript to JavaScript
RUN npm run build

# The app binds to port 4001, so use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 4001

# Define the command to run your app using CMD which defines your runtime
CMD [ "node", "./dist/index.js" ]
