FROM node:lts-alpine
ENV NODE_ENV=production
ENV PORT="3000"
ENV TRELLO_APIURL="https://api.trello.com/1"
ENV DEFAULT_LIST="To Do"
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
COPY . .
EXPOSE 3000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "start"]