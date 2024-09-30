const express = require('express');
const { getAllOffers, deleteOffer, updateOffer, createOffer, getAllActiveOffers } = require('../controllers/offer');
const router = express.Router();

router.post('/createOffer', createOffer);
router.get('/getOffers', getAllOffers);
router.delete('/deleteOffer/:id', deleteOffer);
router.put('/updateOffer/:id', updateOffer);
router.get('/getAllActiveOffers', getAllActiveOffers)

module.exports = router;
