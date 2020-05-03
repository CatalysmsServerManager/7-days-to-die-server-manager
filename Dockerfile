FROM node:10

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
RUN bash /usr/src/app/scripts/itemIconsUpdate.sh

EXPOSE 1337
CMD [ "node", "app.js" ]
