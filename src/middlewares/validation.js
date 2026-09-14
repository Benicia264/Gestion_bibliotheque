// ============================================================
// MIDDLEWARE DE VALIDATION DES CHAMPS
// ============================================================

// Ce middleware permet de vérifier automatiquement que les
// champs obligatoires envoyés dans req.body sont bien présents
// et qu'ils ne sont pas vides.

const validerChamps = (champsRequis) => {
    return (req, res, next) => {
        const erreurs = [];
        // On parcourt la liste des champs qui sont obligatoires
        champsRequis.forEach((champ) => {
            // Récupère la valeur du champ envoyé par le client
            const valeur = req.body[champ];
            // Vérifie si la valeur est undefined, null ou une chaîne vide
            if (
                valeur === undefined ||
                valeur === null ||
                valeur.toString().trim() === ""
            ) {
                erreurs.push(`Le champ "${champ}" est obligatoire.`);
            }
        });
        // Si des erreurs ont été trouvées, on renvoie une réponse 400 avec les messages d'erreur
        if (erreurs.length > 0) {
            return res.status(400).json({
                message: erreurs.join(" ")
            });
        }
        // Si tout est correct, on continue vers le contrôleur
        next();
    };
};

// Champs obligatoires pour créer ou modifier un auteur
const validerAuteur = validerChamps([
    "nom",
    "nationalite"
]);
// Champs obligatoires pour créer ou modifier un adhérent
const validerAdherent = validerChamps([
    "nom",
    "contact",
    "date_inscription"
]);
// Champs obligatoires pour créer ou modifier un livre
const validerLivre = validerChamps([
    "titre",
    "annee_publication",
    "auteur_id"
]);
// Champs obligatoires pour créer un emprunt
const validerEmprunt = validerChamps([
    "adherent_id",
    "livre_id",
    "date_retour_prevue"
]);
module.exports = {
    validerChamps,
    validerAuteur,
    validerAdherent,
    validerLivre,
    validerEmprunt
};