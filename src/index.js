const express = require("express");
const app = express();
require('dotenv').config();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const trelloCardsRouter = require('./router/trelloCards');
const trelloListsRouter = require('./router/trelloLists');

app.use('/', trelloCardsRouter);
app.use('/', trelloListsRouter);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`Spacex issue tracker is  listenning on port: ${server.address().port}`);
});

