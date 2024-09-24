const express = require('express');
const { createAdmin } = require('../controllers/admin');

const router = express.Router()

router.post('/createAdmin', createAdmin)

module.exports = router;