const express = require('express');
const router = express.Router();
const auteurController = require('../controllers/auteurController');
const { validerAuteur } = require('../middlewares/validation');


//Liste des auteurs
router.get('/',  auteurController.getAuteurs)

//Ajouter un auteur
router.post('/', validerAuteur, auteurController.createAuteur)

//Modifier un auteur
router.put('/:id', validerAuteur, auteurController.updateAuteur)

//Supprimer un auteur
router.delete('/:id', auteurController.deleteAuteur)

module.exports = router;