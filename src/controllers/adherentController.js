const adherentModel = require('../models/adherentModel');

//Lister les adhérents
const getAdherents = async (req, res) => {
    try {
        const adherents = await adherentModel.getAllAdherents();
        res.json(adherents);
    } catch (error) {
        console.error('Error lors de la récupération des adhérents:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Ajouter un adhérent
const createAdherent = async (req, res) => {
    try {
        const { nom, contact, date_inscription } = req.body;
        const adherent = await adherentModel.createAdherent(nom, contact, date_inscription);
        res.status(201).json(adherent);
    } catch (error) {
        console.error('Error lors de la création d\'un adhérent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Modifier un adhérent
const updateAdherent = async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, contact, date_inscription } = req.body;
        const adherent = await adherentModel.updateAdherent(id, nom, contact, date_inscription);
        if (!adherent) {
            return res.status(404).json({ error: 'Adhérent introuvable' });
        }
        res.json(adherent);
    } catch (error) {
        console.error('Error lors de la mise à jour d\'un adhérent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//Supprimer un adhérent
const deleteAdherent = async (req, res) => {
    try {
        const { id } = req.params;
        const adherent = await adherentModel.deleteAdherent(id);
        if (!adherent) {
            return res.status(404).json({ error: 'Adhérent introuvable' });
        }
        res.json({ message: 'Adhérent supprimé avec succès' });
    } catch (error) {
        console.error('Error lors de la suppression d\'un adhérent:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = {
    getAdherents,
    createAdherent,
    updateAdherent,
    deleteAdherent
};