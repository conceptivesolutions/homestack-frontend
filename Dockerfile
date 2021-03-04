# First Stage
# First run the build with all dependencies (including dev dependencies, used for typescript)
FROM node:15-alpine AS build

# add build stuff
RUN apk add --no-cache python make gcc g++

# set workdir, instead of using root
RUN mkdir /app
WORKDIR /app

# Copy in only the parts needed to install dependencies
# (This avoids rebuilds if the package.json hasn’t changed)
COPY package.json yarn.lock .npmrc /app/

# do not generate sourcemaps in production mode
ARG GENERATE_SOURCEMAP=false

# Install dependencies (including dev dependencies)
RUN yarn install

# Copy in the rest of the project
COPY . /app/

# Build the project
RUN yarn run build

# Second Stage
# Runtime
FROM node:15-alpine

# set workdir, instead of using root
RUN mkdir /app
WORKDIR /app

# Copy Files
COPY --from=build /app/build /app/build
COPY --from=build /app/server.js /app/server.js

# Install executive dependencies that are necessary to run the server
COPY package.live.json /app/package.json
RUN yarn install

# Modify Port to listen on 3000
ENV PORT=3000

# Set runtime metadata
EXPOSE 3000
CMD ["node", "./server.js"]
