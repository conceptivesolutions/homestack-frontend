# First Stage
# First run the build with all dependencies (including dev dependencies, used for typescript)
FROM node:12-alpine AS build

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
FROM node:12-alpine
ENV NODE_ENV production
ENV PORT 3000

# set workdir, instead of using root
RUN mkdir /app
WORKDIR /app

# Install dependencies (NOT including dev dependencies, because of NODE_ENV)
COPY package.json yarn.lock .npmrc /app/
RUN yarn install

# Get the built application from the first stage
COPY --from=build /app/.next /app/.next
COPY --from=build /app/public /app/public

# Add a nextjs user, to force running in non-root mode
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001
RUN chown nextjs:nodejs -R /app
USER nextjs

# Set runtime metadata
EXPOSE 3000
CMD [ "yarn", "start" ]
