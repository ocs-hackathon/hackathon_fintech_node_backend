const express = require('express');
const { getAllOffers, deleteOffer, updateOffer } = require('../controllers/offer');
const router = express.Router();

router.post('/createOffer/:id', createOffer);
router.get('/getOffers', getAllOffers);
router.delete('/deleteOffer/:id', deleteOffer);
router.put('/updateOffer/:id', updateOffer);

module.exports = router;
