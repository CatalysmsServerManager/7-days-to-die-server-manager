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
COPY . .

# Install 7d2d item icons
USER root
RUN chmod +x /usr/src/app/scripts/itemIconsUpdate.sh
RUN /usr/src/app/scripts/itemIconsUpdate.sh
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 1337
CMD [ "node", "app.js" ]