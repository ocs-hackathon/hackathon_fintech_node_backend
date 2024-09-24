const express = require('express');
const { registerUser, blockUser, fetchAllUsers } = require('../controllers/user');

const router = express.Router();

router.post('/register', registerUser);
router.get('/fetchUsers', fetchAllUsers);
router.put('/blockUser/:id', blockUser)

module.exports = router;
