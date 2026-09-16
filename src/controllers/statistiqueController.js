const statistiqueModel = require('../models/statistiqueModel');

//Lister les auteurs
const getAuteurStat = async (req, res, next) => {
    try {
        const total= await statistiqueModel.getAllAuteurStat();
        res.status(200).json({ totalAuteurs: total });
    } catch (error) {
        next(error);
    }
};

//Lister les livres
const getLivreStat = async (req, res, next) => {
    try {
        const total= await statistiqueModel.getAllLivreStat();
        res.status(200).json({ totalLivres: total });
    } catch (error) {
        next(error);
    }
};

//Lister les adherents
const getAdherentStat = async (req, res, next) => {
    try {   
        const total= await statistiqueModel.getAllAdherentStat();
        res.status(200).json({ totalAdherents: total });
    } catch (error) {
        next(error);
    }
    }


//Lister les emprunts en cours
const getEmpruntStat = async (req, res, next) => {
    try {
        const total= await statistiqueModel.getAllEmpruntStat();
        res.status(200).json({ totalEmpruntsEnCours: total });
    } catch (error) {
        next(error);
    }
};

//Lister les emprunts en retard
const getEmpruntStatRetard = async (req, res, next) => {
    try {
        const total= await statistiqueModel.getAllEmpruntStatRetard();
        res.status(200).json({ totalEmpruntsEnRetard: total });
    } catch (error) {
        next(error);
    }
    }


//Lister le livre le plus emprunté
const getLivreEmprunt= async(req, res, next) => {
    try {
        const total= await statistiqueModel.getMoreLivreEmprunt();
        res.status(200).json({ livrePlusEmprunte: total });
    } catch (error) {
        next(error);
    }
};

//Lister l'adhérent le plus actif
const getPlusActifAdherent= async(req, res, next) => {
    try {
        const total= await statistiqueModel.getActifAdherent();
        res.status(200).json({ adherentPlusActif: total });
    } catch (error) {
        next(error);
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