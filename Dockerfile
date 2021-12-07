FROM node:14-alpine AS builder

RUN apk --no-cache add curl=7.79.1-r0 git=2.32.0-r0 jq=1.6-r1 python3=3.9.5-r2

# Create app directory
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app
USER node

COPY scripts/ ./scripts

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

ARG PLAYGROUND_VERSION=latest
RUN echo "Using playground version $PLAYGROUND_VERSION"

RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

FROM node:14-alpine
WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app .

RUN chown -R node:node /usr/src/app
USER node

HEALTHCHECK --interval=10s --timeout=2s --start-period=10s --retries=3 CMD [ "node", "/usr/src/app/scripts/healthcheck.js" ]

EXPOSE 1337
CMD [ "npm", "run", "start" ]
