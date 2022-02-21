const express = require('express');
const router = express.Router();
const { getBoardLists } = require("../controllers/trelloLists");


router.get('/boardLists', getBoardLists);

module.exports = router;