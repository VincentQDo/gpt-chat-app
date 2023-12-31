# Choose base image with Node.js 20 installed
FROM node:18.6.0-slim AS base

# Enable corepack. Corepack is a tool that aims to prepare the execution
# environment for package managers. It's a zero-runtime-dependency package acting as a bridge
# between Node.js projects and the package managers they are intended to use.i
# In practical terms, Corepack lets you use Yarn,
# npm, and pnpm without having to install them.
RUN corepack enable
RUN corepack prepare npm@9.6.3 --activate

# Copy all files from current directory into the '/app' directory 
# of the Docker image and make it the default working directory.
COPY . /app
WORKDIR /app

# New stage for complete build dependencies along with the source code.
FROM base AS build
# Install all dependencies (including dev dependencies for build purposes)
RUN npm install
# Build the application
RUN npm run build

# New stage for production dependencies
FROM build AS prod-deps
RUN npm ci --omit=dev

# Final stage: Start with a fresh base image again to keep the final Docker image slim
FROM base 
# Copy node_modules from 'prod-deps' with production dependencies only.
COPY --from=prod-deps /app/node_modules ./node_modules
# Copy built application from 'build' stage
COPY --from=build /app/build ./build
# Expose the port on which the application will run
ENV PORT=3000 ORIGIN=https://gptchat.avltech.dev
EXPOSE 3000
# Define the command that will be executed when Docker runs the image.
CMD [ "node", "build" ]