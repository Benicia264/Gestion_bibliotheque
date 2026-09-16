

const pool = require('../config/db');

//Lister tous les auteurs
const getAllAuteurs = async () => {
    const result = await pool.query('SELECT * FROM auteurs');
    return result.rows
}

//Ajout d'un auteur
const createAuteur = async (nom, nationalite) => {
    const result = await pool.query('INSERT INTO auteurs (nom, nationalite) VALUES ($1, $2) RETURNING *', [nom, nationalite]);
    return result.rows[0];
}

//Modifier un auteur
const updateAuteur = async (id, nom, nationalite) => {
    const result = await pool.query('UPDATE auteurs SET nom=$1, nationalite=$2 WHERE id=$3 RETURNING *', [nom, nationalite, id]);
    return result.rows[0];
}

//Supprimer un auteur
const deleteAuteur = async (id) => {
    const result = await pool.query('DELETE FROM auteurs WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    getAllAuteurs,
    createAuteur,
    updateAuteur,
    deleteAuteur
}
