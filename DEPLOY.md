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

## 1. Importer le schéma dans PostgreSQL

`database/bibliothèque.sql` est un dump complet (schéma + éventuellement des
données). Il n'est **pas exécuté automatiquement** au démarrage de
l'application — à importer une seule fois, via le terminal du service
PostgreSQL dans Dokploy ou avec `psql` depuis un poste ayant accès à la base :

```bash
psql "postgresql://<user>:<password>@<host interne dokploy>:5432/<database>" \
  -f "database/bibliothèque.sql"
```

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

- `GET https://<domaine>/health` doit répondre `{"status":"ok"}`.
- Les logs de l'application doivent afficher `Connecté à la base de données
  avec succès !` — sinon, vérifier `DB_HOST`/`DB_USER`/`DB_PASSWORD` et que le
  service PostgreSQL autorise les connexions depuis le réseau interne
  Dokploy.
