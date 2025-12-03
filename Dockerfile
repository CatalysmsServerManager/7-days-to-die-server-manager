FROM node:19-alpine AS builder

RUN apk --no-cache add curl git jq python3

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

RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

FROM node:19-alpine
WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app .

RUN chown -R node:node /usr/src/app
USER node

HEALTHCHECK --interval=10s --timeout=2s --start-period=10s --retries=3 CMD [ "node", "/usr/src/app/scripts/healthcheck.js" ]

EXPOSE 1337
CMD [ "npm", "run", "start" ]
