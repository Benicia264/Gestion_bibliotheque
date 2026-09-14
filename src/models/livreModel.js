const pool = require('../config/db');

// Récupérer tous les livres (avec recherche + pagination), nom de l'auteur inclus
const getAllLivres = async (recherche, page = 1, limite = 10) => {
    const offset = (page - 1) * limite;
    const searchTerm = `%${recherche || ''}%`;

    const result = await pool.query(
        `SELECT l.id, l.titre, l.annee_publication, l.statut, a.nom AS auteur_nom
         FROM livres l
         JOIN auteurs a ON l.auteur_id = a.id
         WHERE l.titre ILIKE $1 OR a.nom ILIKE $1
         ORDER BY l.id
         LIMIT $2 OFFSET $3`,
        [searchTerm, limite, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM livres l
         JOIN auteurs a ON l.auteur_id = a.id
         WHERE l.titre ILIKE $1 OR a.nom ILIKE $1`,
        [searchTerm]
    );

    return {
        livres: result.rows,
        total: parseInt(countResult.rows[0].count, 10),
        page: parseInt(page, 10),
        totalPages: Math.ceil(countResult.rows[0].count / limite)
    };
};

// Récupérer un livre par id
const getLivreById = async (id) => {
    const result = await pool.query(
        `SELECT l.id, l.titre, l.annee_publication, l.statut, a.nom AS auteur_nom
         FROM livres l
         JOIN auteurs a ON l.auteur_id = a.id
         WHERE l.id = $1`,
        [id]
    );
    return result.rows[0];
};

// Créer un livre
const createLivre = async (titre, annee_publication, auteur_id) => {
    const result = await pool.query(
        `INSERT INTO livres (titre, annee_publication, statut, auteur_id)
         VALUES ($1, $2, 'disponible', $3)
         RETURNING *`,
        [titre, annee_publication, auteur_id]
    );
    return result.rows[0];
};

// Modifier un livre
const updateLivre = async (id, titre, annee_publication, auteur_id) => {
    const result = await pool.query(
        `UPDATE livres
         SET titre = $1, annee_publication = $2, auteur_id = $3
         WHERE id = $4
         RETURNING *`,
        [titre, annee_publication, auteur_id, id]
    );
    return result.rows[0];
};

// Supprimer un livre
const deleteLivre = async (id) => {
    const result = await pool.query(
        `DELETE FROM livres WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
};

// Changer le statut d'un livre (utilisé par le module emprunts)
const updateStatutLivre = async (id, statut) => {
    const result = await pool.query(
        `UPDATE livres SET statut = $1 WHERE id = $2 RETURNING *`,
        [statut, id]
    );
    return result.rows[0];
};

module.exports = {
    getAllLivres,
    getLivreById,
    createLivre,
    updateLivre,
    deleteLivre,
    updateStatutLivre
};