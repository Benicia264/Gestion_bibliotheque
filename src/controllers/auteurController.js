const auteurModel = require('../models/auteurModel');

//Lister les auteurs
const getAuteurs = async (req, res) => {
    try {
        const auteurs = await auteurModel.getAllAuteurs();
        res.json(auteurs);
    } catch (error) {
        console.error("Détail de l'erreur:",error);
        res.status(500).json({
            message: 'Erreur lors de la récupération des auteurs'
        })
    }
}

//Ajouter un auteur
const createAuteur = async (req, res) => {
    try {
        const { nom, nationalite } = req.body;
        const auteur = await auteurModel.createAuteur(nom, nationalite);
        res.status(201).json(auteur);
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la création de l\'auteur'
        })
    }
}

//Modifier un auteur
const updateAuteur = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, nationalite } = req.body;
        const auteur = await auteurModel.updateAuteur(id, nom, nationalite)
        if (!auteur) {
            res.status(404).json({
                message: 'Auteur introuvable'
            })
        }
        res.json(auteur)
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la mise à jour de l\'auteur'
        })
    }
        
}

//Supprimer un auteur
const deleteAuteur = async (req, res) => {
    try {
        const { id } = req.params;
        const auteur = await auteurModel.deleteAuteur(id);
        if (!auteur) {
            res.status(404).json({
                message: 'Auteur introuvable'
            })
        }
        res.json(auteur)
    } catch (error) {
        res.status(500).json({
            message: 'Erreur lors de la suppression de l\'auteur'
        })
    }
}

module.exports = {
    getAuteurs,
    createAuteur,
    updateAuteur,
    deleteAuteur
}