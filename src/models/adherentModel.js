const pool = require('../config/db');

//Lister les adhérents
const getAllAdherents = async () => {
    const result = await pool.query('SELECT * FROM adherents');
    return result.rows;
};

//Ajouter un adhérent
const createAdherent = async (nom, contact, date_inscription) => {
    const result = await pool.query(
        'INSERT INTO adherent(nom, contact, date_inscription) VALUES($1, $2, $3) RETURNING *',
        [nom, contact, date_inscription]
    );
    return result.rows[0];
};

//Modifier un adhérent
const updateAdherent = async (id,  nom, contact, date_inscription) => {
    const result = await pool.query(
        'UPDATE adherent SET nom=$1, contact=$2, date_inscription=$3 WHERE id=$4 RETURNING *',
        [nom, contact, date_inscription, id]
    );
    return result.rows[0];
}

//Supprimer un adhérent
const deleteAdherent = async (id) => {
    const result = await pool.query('DELETE FROM adherent WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
}

module.exports = {
    getAllAdherents,
    createAdherent,
    updateAdherent,
    deleteAdherent
};
