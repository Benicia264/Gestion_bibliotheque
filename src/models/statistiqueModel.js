const pool= require('../config/db');

//Lister les auteurs
const getAllAuteurStat = async () => {
    const result= await pool.query(`SELECT COUNT(*) from auteurs`);
    return result.rows[0].count;
}

//Lister les livres
const getAllLivreStat = async () => {
    const result= await pool.query(`SELECT COUNT(*) from livres`);
    return result.rows[0].count;
}

//Lister les adherents
const getAllAdherentStat = async () => {
    const result= await pool.query(`SELECT COUNT(*) from adherents`);
    return result.rows[0].count;
}

//Lister les emprunts en cours
const getAllEmpruntStat = async () => {
    const result= await pool.query(`SELECT COUNT(*) from emprunts where date_retour_effective IS NULL`);
    return result.rows[0].count;
}

//Lister les emprunts en retard
const getAllEmpruntStatRetard = async () => {
    const result= await pool.query(`SELECT COUNT(*) from emprunts where date_retour_effective IS NULL AND date_retour_prevue < CURRENT_DATE`);
    return result.rows[0].count;
}

//Lister le livre le plus emprunté
const getMoreLivreEmprunt= async() => {
    const result= await pool.query(`SELECT l.id, l.titre, COUNT(*) as emprunts FROM emprunts e JOIN livres l ON e.livre_id = l.id GROUP BY l.id, l.titre ORDER BY emprunts DESC LIMIT 1`);
    return result.rows[0];
}

//Lister l'auteur le plus actif
const getActifAdherent= async() => {
    const result= await pool.query(`SELECT a.nom, COUNT(*) as emprunts FROM emprunts e JOIN adherents a ON e.adherent_id = a.id GROUP BY a.id, a.nom ORDER BY emprunts DESC LIMIT 1`);
    return result.rows[0];
}

module.exports= {
    getAllAuteurStat,
    getAllLivreStat,
    getAllAdherentStat,
    getAllEmpruntStat,
    getAllEmpruntStatRetard,
    getMoreLivreEmprunt,
    getActifAdherent
}