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

# Install dependencies (including dev dependencies)
RUN yarn install

# Copy in the rest of the project
COPY . /app/

# Build the project
RUN yarn run build

# Second Stage
# Runtime
FROM nginx:1.18-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Set runtime metadata
EXPOSE 3000
CMD ["/bin/sh", "-c", "sed -i 's/listen  .*/listen 3000;/g' /etc/nginx/conf.d/default.conf && exec nginx -g 'daemon off;'"]
