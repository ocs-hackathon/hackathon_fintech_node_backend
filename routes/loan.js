const express = require('express');
const { createLoanAndManageCurrency } = require('../controllers/loan');

const router = express.Router();

router.put('/takeLoan/:id', createLoanAndManageCurrency)

module.exports = router