const express = require('express');
const router = express.Router();
const { createTask } = require("../controllers/trelloCards");


router.post('/createTask', createTask);

module.exports = router;