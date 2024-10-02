const express = require('express');
const { registerUser, blockUser, fetchAllUsers, dashboard } = require('../controllers/user');

const router = express.Router();

router.post('/register', registerUser);
router.get('/fetchUsers', fetchAllUsers);
router.put('/blockUser/:id', blockUser);
router.get('/dashboard', dashboard)

module.exports = router;
