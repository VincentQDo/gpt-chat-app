# Set up stage for the next 2 stages
FROM node:18.6.0-slim AS base
# Enable corepack. Corepack is a tool that aims to prepare the execution
# environment for package managers. It's a zero-runtime-dependency package acting as a bridge
# between Node.js projects and the package managers they are intended to use.i
# In practical terms, Corepack lets you use Yarn,
# npm, and pnpm without having to install them.
RUN corepack enable
RUN corepack prepare npm@9.6.3 --activate

# Set work dir to /app and copy package jsons over
WORKDIR /app
COPY package*.json ./

# New stage to build the application
FROM base AS build

# Install all dependencies (including dev dependencies for build purposes)
RUN npm ci
# Copy the rest of the app and build it
COPY . .
RUN npm run build

# New stage to get production dependencies
FROM base AS prod-dependencies
RUN npm ci --omit=dev

# Final stage we build the image from
FROM node:18.6.0-slim AS prod
# Copy pacakge json over because we need it due to some module stuff I'm not real clear on
COPY --from=base /app/package*.json ./
# Copy node_modules from 'prod-dependencies' with production dependencies only. 
COPY --from=prod-dependencies /app/node_modules ./node_modules
# Copy built application from 'build' stage
COPY --from=build /app/build ./build
# Expose the port on which the application will run
ENV PORT=3000 ORIGIN=*
EXPOSE 3000
# Define the command that will be executed when Docker runs the image.
CMD [ "node", "build" ]
