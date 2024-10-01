const express = require('express');
const { createLoanAndManageCurrency, payBack, getLoans } = require('../controllers/loan');

const router = express.Router();

router.put('/takeLoan/:id', createLoanAndManageCurrency)
router.get('/getLoans', getLoans)
router.put('/payBack', payBack)

module.exports = router