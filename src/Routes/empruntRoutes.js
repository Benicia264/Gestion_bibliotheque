const express = require('express');
const router = express.Router();
const empruntController = require('../controllers/empruntController');
const { validerEmprunt } = require('../middlewares/validation');
// Récupérer tous les emprunts
router.get('/', empruntController.getEmprunts);
// Récupérer les emprunts en cours
router.get('/en-cours', empruntController.getEmpruntsEnCours);
// Récupérer les emprunts en retard
router.get('/en-retard', empruntController.getEmpruntsEnRetard);
// Récupérer un emprunt par son ID
router.get('/:id', empruntController.getEmpruntById);
// Créer un emprunt
router.post(
    '/',
    validerEmprunt,
    empruntController.createEmprunt
);
// Retourner un livre
router.put('/:id/retour', empruntController.retournerLivre);
module.exports = router;