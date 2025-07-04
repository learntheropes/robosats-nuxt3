# Set the base image to Node 18
FROM node:18

# Update the repository sources list
RUN apt-get update && apt-get upgrade -y

# Install Tor
RUN apt-get install -y tor

# Set the working directory to /app
WORKDIR /app

# Bundle the app source inside the docker image
COPY . .

# Set app environment variables
ARG ROBOSATS_COORDINATOR_URL
ENV ROBOSATS_COORDINATOR_URL=${ROBOSATS_COORDINATOR_URL}

# Install all the app npm packages
RUN npm install

# Build the nuxt app
RUN npm run build

# Bind docker daemon to port 8080
EXPOSE 8080

# Start Tor and the Node application
CMD service tor start && node .output/server/index.mjs
