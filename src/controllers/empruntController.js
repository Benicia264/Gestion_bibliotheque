const empruntModel = require('../models/empruntModel');
const livreModel = require('../models/livreModel');


// RÉCUPÉRER TOUS LES EMPRUNTS
// GET /api/emprunts

const getEmprunts = async (req, res) => {
    try {

        const emprunts = await empruntModel.getAllEmprunts();

        res.status(200).json(emprunts);

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération des emprunts",
            error: error.message
        });
    }
};


// RÉCUPÉRER UN EMPRUNT PAR SON ID
// GET /api/emprunts/:id

const getEmpruntById = async (req, res) => {
    try {

        const emprunt = await empruntModel.getEmpruntById(
            req.params.id
        );

        if (!emprunt) {
            return res.status(404).json({
                message: "Emprunt introuvable"
            });
        }

        res.status(200).json(emprunt);

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération de l'emprunt",
            error: error.message
        });
    }
};


// CRÉER UN EMPRUNT
// POST /api/emprunts

const createEmprunt = async (req, res) => {
    try {

        const {
            adherent_id,
            livre_id,
            date_retour_prevue
        } = req.body;


        // 1. Vérifier que le livre existe

        const livre = await empruntModel.getLivreById(livre_id);

        if (!livre) {
            return res.status(404).json({
                message: "Livre introuvable"
            });
        }


        // 2. Vérifier que le livre est disponible

        if (livre.statut !== "disponible") {
            return res.status(400).json({
                message: "Ce livre est déjà emprunté"
            });
        }


        // 3. Vérifier que cet adhérent n'a pas
        // déjà ce même livre en cours

        const empruntActif =
            await empruntModel.getEmpruntActif(
                adherent_id,
                livre_id
            );

        if (empruntActif) {
            return res.status(400).json({
                message: "Cet adhérent a déjà ce livre en cours d'emprunt"
            });
        }


        // 4. Créer l'emprunt

        const nouvelEmprunt =
            await empruntModel.createEmprunt(
                adherent_id,
                livre_id,
                date_retour_prevue
            );


        // 5. Changer le statut du livre

        await livreModel.updateStatutLivre(
            livre_id,
            "emprunte"
        );


        // 6. Envoyer la réponse

        res.status(201).json({
            message: "Emprunt enregistré avec succès",
            emprunt: nouvelEmprunt
        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la création de l'emprunt",
            error: error.message
        });
    }
};


// ENREGISTRER LE RETOUR D'UN LIVRE
// PUT /api/emprunts/:id/retour

const retournerLivre = async (req, res) => {
    try {

        // 1. Récupérer l'emprunt concerné

        const emprunt =
            await empruntModel.getEmpruntById(
                req.params.id
            );


        // 2. Vérifier que l'emprunt existe

        if (!emprunt) {
            return res.status(404).json({
                message: "Emprunt introuvable"
            });
        }


        // 3. Vérifier que le livre n'a pas déjà été rendu

        if (emprunt.date_retour_effective) {
            return res.status(400).json({
                message: "Ce livre a déjà été rendu"
            });
        }


        // 4. Enregistrer la date de retour

        const empruntRetourne =
            await empruntModel.retournerLivre(
                req.params.id
            );


        // Vérifier que le retour a bien été enregistré

        if (!empruntRetourne) {
            return res.status(400).json({
                message: "Impossible d'enregistrer le retour"
            });
        }


        // 5. Remettre le livre à l'état disponible

        await livreModel.updateStatutLivre(
            emprunt.livre_id,
            "disponible"
        );


        // 6. Envoyer la réponse

        res.status(200).json({
            message: "Livre retourné avec succès",
            emprunt: empruntRetourne
        });

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors du retour du livre",
            error: error.message
        });
    }
};


// RÉCUPÉRER LES EMPRUNTS EN COURS
// GET /api/emprunts/en-cours

const getEmpruntsEnCours = async (req, res) => {
    try {

        const emprunts =
            await empruntModel.getEmpruntsEnCours();

        res.status(200).json(emprunts);

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération des emprunts en cours",
            error: error.message
        });
    }
};


// RÉCUPÉRER LES EMPRUNTS EN RETARD
// GET /api/emprunts/en-retard

const getEmpruntsEnRetard = async (req, res) => {
    try {

        const emprunts =
            await empruntModel.getEmpruntsEnRetard();

        res.status(200).json(emprunts);

    } catch (error) {

        res.status(500).json({
            message: "Erreur lors de la récupération des emprunts en retard",
            error: error.message
        });
    }
};


module.exports = {
    getEmprunts,
    getEmpruntById,
    createEmprunt,
    retournerLivre,
    getEmpruntsEnCours,
    getEmpruntsEnRetard
};