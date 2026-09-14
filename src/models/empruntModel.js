const pool = require('../config/db');

// Récupérer tous les emprunts
const getAllEmprunts = async () => {
    const result = await pool.query(
        `SELECT e.id,
                e.adherent_id,
                a.nom AS adherent_nom,
                e.livre_id,
                l.titre AS livre_titre,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_effective
         FROM emprunts e
         JOIN adherents a ON e.adherent_id = a.id
         JOIN livres l ON e.livre_id = l.id
         ORDER BY e.id`
    );

    return result.rows;
};


// Récupérer un emprunt par son ID
const getEmpruntById = async (id) => {
    const result = await pool.query(
        `SELECT e.id,
                e.adherent_id,
                a.nom AS adherent_nom,
                e.livre_id,
                l.titre AS livre_titre,
                e.date_emprunt,
                e.date_retour_prevue,
                e.date_retour_effective
         FROM emprunts e
         JOIN adherents a ON e.adherent_id = a.id
         JOIN livres l ON e.livre_id = l.id
         WHERE e.id = $1`,
        [id]
    );

    return result.rows[0];
};


// Récupérer un livre par son ID
const getLivreById = async (livre_id) => {
    const result = await pool.query(
        `SELECT * FROM livres WHERE id = $1`,
        [livre_id]
    );

    return result.rows[0];
};


// Vérifier si un adhérent a déjà ce livre en cours
const getEmpruntActif = async (adherent_id, livre_id) => {
    const result = await pool.query(
        `SELECT *
         FROM emprunts
         WHERE adherent_id = $1
         AND livre_id = $2
         AND date_retour_effective IS NULL
         LIMIT 1`,
        [adherent_id, livre_id]
    );

    return result.rows[0];
};


// Créer un emprunt
const createEmprunt = async (
    adherent_id,
    livre_id,
    date_retour_prevue
) => {
    const result = await pool.query(
        `INSERT INTO emprunts
         (adherent_id, livre_id, date_emprunt, date_retour_prevue)
         VALUES ($1, $2, CURRENT_DATE, $3)
         RETURNING *`,
        [
            adherent_id,
            livre_id,
            date_retour_prevue
        ]
    );

    return result.rows[0];
};


// Enregistrer le retour d'un livre
const retournerLivre = async (id) => {
    const result = await pool.query(
        `UPDATE emprunts
         SET date_retour_effective = CURRENT_DATE
         WHERE id = $1
         AND date_retour_effective IS NULL
         RETURNING *`,
        [id]
    );

    return result.rows[0];
};


// Récupérer uniquement les emprunts encore en cours
const getEmpruntsEnCours = async () => {
    const result = await pool.query(
        `SELECT e.id,
                a.nom AS adherent_nom,
                l.titre AS livre_titre,
                e.date_emprunt,
                e.date_retour_prevue
         FROM emprunts e
         JOIN adherents a ON e.adherent_id = a.id
         JOIN livres l ON e.livre_id = l.id
         WHERE e.date_retour_effective IS NULL
         ORDER BY e.date_retour_prevue`
    );

    return result.rows;
};


// Récupérer les emprunts en retard
const getEmpruntsEnRetard = async () => {
    const result = await pool.query(
        `SELECT e.id,
                a.nom AS adherent_nom,
                l.titre AS livre_titre,
                e.date_emprunt,
                e.date_retour_prevue
         FROM emprunts e
         JOIN adherents a ON e.adherent_id = a.id
         JOIN livres l ON e.livre_id = l.id
         WHERE e.date_retour_effective IS NULL
         AND e.date_retour_prevue < CURRENT_DATE
         ORDER BY e.date_retour_prevue`
    );

    return result.rows;
};


module.exports = {
    getAllEmprunts,
    getEmpruntById,
    getLivreById,
    getEmpruntActif,
    createEmprunt,
    retournerLivre,
    getEmpruntsEnCours,
    getEmpruntsEnRetard
};