const express = require('express');
const router = express.Router();
const auteurController = require('../controllers/auteurController');

//Liste des auteurs
router.get('/', auteurController.getAuteurs)

//Ajouter un auteur
router.post('/', auteurController.createAuteur)

//Modifier un auteur
router.put('/:id', auteurController.updateAuteur)

//Supprimer un auteur
router.delete('/:id', auteurController.deleteAuteur)

module.exports = router;