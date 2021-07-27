FROM node:14-alpine AS builder

RUN apk --no-cache add curl=7.67.0-r5 git=2.24.4-r0

# Create app directory
WORKDIR /usr/src/app
RUN chown -R node:node /usr/src/app
USER node

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm ci --only=production

# Bundle app source
COPY --chown=node:node . .

# Install 7d2d item icons
RUN ash /usr/src/app/scripts/itemIconsUpdate.sh

FROM node:14-alpine
WORKDIR /usr/src/app

COPY --chown=node:node --from=builder /usr/src/app .

RUN chown -R node:node /usr/src/app
USER node

HEALTHCHECK --interval=10s --timeout=2s --start-period=10s --retries=3 CMD [ "node", "/usr/src/app/scripts/healthcheck.js" ]

EXPOSE 1337
CMD [ "npm", "run", "start" ]
