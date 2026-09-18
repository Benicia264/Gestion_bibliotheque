const express = require('express');
const router = express.Router();
const adherentController = require('../controllers/adherentController');
const { validerAdherent } = require('../middlewares/validation');

// Route pour lister les adhérents
router.get('/', adherentController.getAdherents);

// Route pour ajouter un adhérent
router.post('/', validerAdherent, adherentController.createAdherent);

// Route pour voir l'historique des emprunts d'un adhérent
router.get('/:id/emprunts', adherentController.getHistoriqueEmprunts);

// Route pour modifier un adhérent
router.put('/:id', adherentController.updateAdherent);

// Route pour supprimer un adhérent
router.delete('/:id', adherentController.deleteAdherent);

module.exports = router;