const adherentModel = require('../models/adherentModel');

// Lister les adhérents
const getAdherents = async (req, res, next) => {
    try {
        const adherents = await adherentModel.getAllAdherents();
        res.json(adherents);
    } catch (error) {
        next(error);
    }
};

// Ajouter un adhérent
const createAdherent = async (req, res, next) => {
    try {
        const { nom, contact, date_inscription } = req.body;
        const adherent = await adherentModel.createAdherent(
            nom,
            contact,
            date_inscription
        );
        res.status(201).json(adherent);
    } catch (error) {
        next(error);
    }
};

// Modifier un adhérent
const updateAdherent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nom, contact, date_inscription } = req.body;

        const adherent = await adherentModel.updateAdherent(
            id,
            nom,
            contact,
            date_inscription
        );

        if (!adherent) {
            return res.status(404).json({
                error: 'Adhérent introuvable'
            });
        }

        res.json(adherent);
    } catch (error) {
        next(error);
    }
};

// Supprimer un adhérent
const deleteAdherent = async (req, res, next) => {
    try {
        const { id } = req.params;

        const adherent = await adherentModel.deleteAdherent(id);

        if (!adherent) {
            return res.status(404).json({
                error: 'Adhérent introuvable'
            });
        }

        res.json({
            message: 'Adhérent supprimé avec succès'
        });
    } catch (error) {
        next(error);
    }
};

// Voir l'historique des emprunts d'un adhérent
const getHistoriqueEmprunts = async (req, res, next) => {
    try {
        const { id } = req.params;

        const historique = await adherentModel.getHistoriqueEmprunts(id);

        res.json(historique);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAdherents,
    createAdherent,
    updateAdherent,
    deleteAdherent,
    getHistoriqueEmprunts
};