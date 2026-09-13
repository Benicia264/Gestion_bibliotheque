const express = require('express');
const router = express.Router();
const adherentController = require('../controllers/adherentController');

//Route pour lister les adhérents
router.get('/', adherentController.getAdherents);

//Route pour ajouter un adhérent
router.post('/', adherentController.createAdherent);

//Route pour modifier un adhérent
router.put('/:id', adherentController.updateAdherent);

//Route pour supprimer un adhérent
router.delete('/:id', adherentController.deleteAdherent);

module.exports = router;