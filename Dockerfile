FROM node:alpine

# Set app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
COPY package-lock.json /usr/src/app/
RUN npm install

# Copy app source
COPY . /usr/src/app

# expose the port to outside world
EXPOSE 8080

# start command as per package.json
CMD ["npm", "start"]
