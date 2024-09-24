
const express = require('express');
const router = express.Router();
const { sendXRP } = require('../controllers/transaction');

router.post('/send-xrp', sendXRP);

module.exports = router;
