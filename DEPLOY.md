# Déploiement sur Dokploy

Cette application se déploie comme **une seule application Dokploy**
(backend Express qui sert aussi le frontend statique depuis `public/`),
construite depuis ce dépôt via son `Dockerfile`, plus **un service
PostgreSQL** géré par Dokploy (pas de conteneur Postgres dans ce dépôt).

```
                    ┌──────────────────────────┐
   navigateur  ───▶ │  app (Express + public/) │  port 8080
                    └────────────┬─────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────┐
                    │   PostgreSQL (Dokploy)    │
                    └──────────────────────────┘
```

Le frontend (`public/index.html` + `script.js`) appelle l'API sur des
chemins relatifs (`/api/...`), donc pas de variable d'URL d'API à
configurer côté client.

## Prérequis

- Le dépôt poussé sur une plateforme accessible par Dokploy (GitHub, GitLab,
  ou Git auto-hébergé).
- Un service PostgreSQL déjà créé dans Dokploy (**Databases → PostgreSQL**).

## 1. Import automatique du schéma

`database/bibliothèque.sql` (schéma + données de démo) est importé
**automatiquement au premier démarrage** du conteneur, par
`scripts/start.sh` : au boot, le script vérifie si la table
`public.livres` existe déjà dans la base ; si non, il importe le dump via
`psql`, puis démarre le serveur Node. Aux démarrages/redéploiements
suivants, la table existe déjà et l'import est simplement sauté — aucune
action manuelle n'est nécessaire, et rejouer le dump plusieurs fois ne pose
pas de problème (il est ignoré, pas ré-exécuté).

Il suffit donc que la base PostgreSQL vide existe côté Dokploy (étape 2) et
que les variables d'environnement de connexion soient correctes.

## 2. Déployer l'application

Créer une nouvelle **Application** dans Dokploy :

- **Source** : ce dépôt Git, branche `develop` (ou la branche de prod choisie)
- **Build type** : Dockerfile
- **Build Path** : `/` (racine du dépôt)
- **Dockerfile path** : `Dockerfile`
- **Port** : `8080`
- **Health check path** : `/health`

**Variables d'environnement** (Environment, pas Build Arguments) :

| Variable      | Valeur                                                        |
| ------------- | -------------------------------------------------------------- |
| `DB_HOST`     | Hostname **interne** du service PostgreSQL Dokploy (pas l'IP publique) |
| `DB_PORT`     | `5432`                                                          |
| `DB_USER`     | Utilisateur PostgreSQL du service                               |
| `DB_PASSWORD` | Mot de passe PostgreSQL du service                              |
| `DB_DATABASE` | Nom de la base                                                  |
| `PORT`        | `8080` (déjà la valeur par défaut, optionnel)                   |

Utilise le hostname interne fourni par Dokploy pour `DB_HOST` : les deux
services communiquent sur le même réseau Docker, pas besoin d'exposer
PostgreSQL publiquement.

## 3. Domaine et HTTPS

Dans l'onglet **Domains** de l'application, ajouter le domaine souhaité et
activer le certificat Let's Encrypt fourni par Dokploy. Le port interne à
mapper est `8080`.

## Vérification post-déploiement

- `GET https://<domaine>/health` doit répondre `{"status":"ok","database":"up"}`
  (503 si la base est injoignable).
- Les logs de déploiement doivent afficher soit `Base de données vide : import
  du schéma initial...` suivi de `Import terminé.` (premier déploiement), soit
  `Schéma déjà présent : import ignoré.` (déploiements suivants), puis
  `Connecté à la base de données avec succès !` — sinon, vérifier
  `DB_HOST`/`DB_USER`/`DB_PASSWORD` et que le service PostgreSQL autorise les
  connexions depuis le réseau interne Dokploy.
