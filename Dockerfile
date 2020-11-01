FROM node:12-alpine

RUN mkdir -p /opt/app
RUN apk add --no-cache libc6-compat git python make gcc

WORKDIR /opt/app
COPY . /opt/app

RUN yarn install
RUN npx next telemetry disable

RUN yarn run build

ENV NODE_ENV production
ENV PORT 3000
EXPOSE 3000

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

USER nextjs

CMD [ "yarn", "start" ]
