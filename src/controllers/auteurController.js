const auteurModel = require('../models/auteurModel');

//Lister les auteurs
const getAuteurs = async (req, res, next) => {
    try {
        const auteurs = await auteurModel.getAllAuteurs();
        res.json(auteurs);
    } catch (error) {
        next(error);
    }
}

//Ajouter un auteur
const createAuteur = async (req, res, next) => {
    try {
        const { nom, nationalite } = req.body;
        const auteur = await auteurModel.createAuteur(nom, nationalite);
        res.status(201).json(auteur);
    } catch (error) {
        next(error);
    }
}

//Modifier un auteur
const updateAuteur = async (req, res, next) => {
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
        next(error);
    }
}

//Supprimer un auteur
const deleteAuteur = async (req, res, next) => {
    try {
        const { id } = req.params;
        const auteur = await auteurModel.deleteAuteur(id);
        if (!auteur) {
            return res.status(404).json({
                message: 'Auteur introuvable'
            });
        }
        res.json({ message: 'Auteur supprimé avec succès' });
    } catch (error) {
        next(error);
    }
}

    


module.exports = {
    getAuteurs,
    createAuteur,
    updateAuteur,
    deleteAuteur
}