const express = require('express');
const router = express.Router();
const livreController = require('../controllers/livreController');
const { validerLivre } = require('../middlewares/validation');

router.get('/', livreController.getLivres);
router.get('/:id', livreController.getLivreById);
router.post('/', validerLivre, livreController.createLivre);
router.put('/:id', validerLivre, livreController.updateLivre);
router.delete('/:id', livreController.deleteLivre);

module.exports = router;

