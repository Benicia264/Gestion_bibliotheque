const express = require('express');
const router = express.Router();
const statistiqueController = require('../controllers/statistiqueController');

router.get('/auteurs', statistiqueController.getAuteurStat);
router.get('/livres', statistiqueController.getLivreStat);
router.get('/adherents', statistiqueController.getAdherentStat);
router.get('/emprunts/en-cours', statistiqueController.getEmpruntStat);
router.get('/emprunts/en-retard', statistiqueController.getEmpruntStatRetard);
router.get('/livres/plus-empruntes', statistiqueController.getLivreEmprunt);
router.get('/adherents/plus-actifs', statistiqueController.getPlusActifAdherent);

module.exports = router;