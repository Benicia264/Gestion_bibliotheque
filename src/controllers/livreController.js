const livreModel = require('../models/livreModel');

// GET /api/livres?recherche=...&page=...&limite=...
const getLivres = async (req, res, next) => {
    try {
        const { recherche, page, limite } = req.query;
        const resultat = await livreModel.getAllLivres(recherche, page, limite);
        res.status(200).json(resultat);
    } catch (error) {
        next(error);
    }
};

// GET /api/livres/:id
const getLivreById = async (req, res, next) => {
    try {
        const livre = await livreModel.getLivreById(req.params.id);
        if (!livre) {
            return res.status(404).json({ message: "Livre introuvable" });
        }
        res.status(200).json(livre);
    } catch (error) {
        next(error);
    }
};

// POST /api/livres
const createLivre = async (req, res, next) => {
    try {
        const { titre, annee_publication, auteur_id } = req.body;
        if (!titre || !annee_publication || !auteur_id) {
            return res.status(400).json({ message: "Titre, année de publication et auteur sont obligatoires" });
        }
        const nouveauLivre = await livreModel.createLivre(titre, annee_publication, auteur_id);
        res.status(201).json(nouveauLivre);
    } catch (error) {
        next(error);
    }
};

// PUT /api/livres/:id
const updateLivre = async (req, res, next) => {
    try {
        const { titre, annee_publication, auteur_id } = req.body;
        if (!titre || !annee_publication || !auteur_id) {
            return res.status(400).json({ message: "Titre, année de publication et auteur sont obligatoires" });
        }
        const livreModifie = await livreModel.updateLivre(req.params.id, titre, annee_publication, auteur_id);
        if (!livreModifie) {
            return res.status(404).json({ message: "Livre introuvable" });
        }
        res.status(200).json(livreModifie);
    } catch (error) {
        next(error);
    }
};

// DELETE /api/livres/:id
const deleteLivre = async (req, res, next) => {
    try {
        const livreSupprime = await livreModel.deleteLivre(req.params.id);
        if (!livreSupprime) {
            return res.status(404).json({ message: "Livre introuvable" });
        }
        res.status(200).json({ message: "Livre supprimé avec succès" });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre
};