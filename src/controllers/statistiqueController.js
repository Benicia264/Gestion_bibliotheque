const statistiqueModel = require('../models/statistiqueModel');

//Lister les auteurs
const getAuteurStat = async (req, res) => {
    try {
        const total= await statistiqueModel.getAllAuteurStat();
        res.status(200).json({ totalAuteurs: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques des auteurs", error: error.message });
    }
};

//Lister les livres
const getLivreStat = async (req, res) => {
    try {
        const total= await statistiqueModel.getAllLivreStat();
        res.status(200).json({ totalLivres: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques des livres", error: error.message });
    }
};

//Lister les adherents
const getAdherentStat = async (req, res) => {
    try {   
        const total= await statistiqueModel.getAllAdherentStat();
        res.status(200).json({ totalAdherents: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques des adhérents", error: error.message });
    }
};

//Lister les emprunts en cours
const getEmpruntStat = async (req, res) => {
    try {
        const total= await statistiqueModel.getAllEmpruntStat();
        res.status(200).json({ totalEmpruntsEnCours: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques des emprunts en cours", error: error.message });
    }
};

//Lister les emprunts en retard
const getEmpruntStatRetard = async (req, res) => {
    try {
        const total= await statistiqueModel.getAllEmpruntStatRetard();
        res.status(200).json({ totalEmpruntsEnRetard: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques des emprunts en retard", error: error.message });
    }
};

//Lister le livre le plus emprunté
const getLivreEmprunt= async(req, res) => {
    try {
        const total= await statistiqueModel.getMoreLivreEmprunt();
        res.status(200).json({ livrePlusEmprunte: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques du livre le plus emprunté", error: error.message });
    }
};

//Lister l'adhérent le plus actif
const getPlusActifAdherent= async(req, res) => {
    try {
        const total= await statistiqueModel.getActifAdherent();
        res.status(200).json({ adherentPlusActif: total });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques de l'adhérent le plus actif", error: error.message });
    }
};

module.exports= {
    getPlusActifAdherent,
    getLivreEmprunt,
    getEmpruntStatRetard,
    getEmpruntStat,
    getAdherentStat,
    getLivreStat,
    getAuteurStat
}