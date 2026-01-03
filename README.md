# Dockerized Node.js App

This folder contains a minimal HTTP server that can be built and run using the provided `Dockerfile`.

## Prerequisites
- Docker installed and running

## Build and run
```sh
# Build the image (replace my-node-app with any name you prefer)
docker build -t my-node-app .

# Run the container
docker run -p 3000:3000 my-node-app
```

Visit `http://localhost:3000` to see the response.

## Project structure
- `Dockerfile` – builds the Node.js image
- `index.js` – simple HTTP server listening on port 3000
- `package.json` – app metadata and start script
- `.dockerignore` – keeps unwanted files out of the image
