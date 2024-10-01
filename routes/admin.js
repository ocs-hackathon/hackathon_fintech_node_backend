const express = require('express');
const { createAdmin, dashboard } = require('../controllers/admin');

const router = express.Router()

router.post('/createAdmin', createAdmin)
router.get('/dashboard', dashboard)

module.exports = router;