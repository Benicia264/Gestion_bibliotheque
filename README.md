# 📚 Gestion de bibliothèque

Application web de gestion d'une bibliothèque développée dans le cadre du projet pratique des semaines 14 & 15 d'**Akieni Academy – Cohorte 2**.

Le projet consiste à développer une application permettant de gérer les auteurs, les adhérents, les livres et les emprunts à travers une **API REST** développée avec **Node.js et Express**, ainsi qu'une interface web permettant de consommer cette API.

---

## 📌 Présentation

L'application permet de digitaliser la gestion d'une bibliothèque et de centraliser les principales opérations liées aux ouvrages et aux emprunts.

Elle permet notamment de :

- gérer les auteurs ;
- gérer les adhérents ;
- gérer les livres ;
- enregistrer les emprunts ;
- gérer les retours de livres ;
- suivre les emprunts en cours ;
- identifier les emprunts en retard ;
- rechercher des livres ;
- utiliser la pagination pour les listes ;
- consulter des statistiques sur l'activité de la bibliothèque ;
- utiliser une interface web connectée à l'API REST.

---

## ✨ Fonctionnalités

### 👤 Gestion des auteurs

L'application permet de :

- consulter la liste des auteurs ;
- ajouter un auteur ;
- modifier les informations d'un auteur ;
- supprimer un auteur.

---

### 👥 Gestion des adhérents

L'application permet de :

- consulter la liste des adhérents ;
- ajouter un adhérent ;
- modifier les informations d'un adhérent ;
- supprimer un adhérent ;
- consulter les informations liées aux emprunts des adhérents.

---

### 📖 Gestion des livres

L'application permet de :

- consulter les livres disponibles dans la bibliothèque ;
- ajouter un livre ;
- modifier un livre ;
- supprimer un livre ;
- associer un livre à son auteur ;
- rechercher un livre ;
- gérer la disponibilité des livres ;
- utiliser la pagination pour les listes de livres.

Un livre peut notamment être identifié comme **disponible** ou **emprunté**.

---

### 🔄 Gestion des emprunts

Le système permet d'enregistrer les emprunts en associant un adhérent à un livre.

Lorsqu'un emprunt est effectué :

- le livre concerné est associé à l'adhérent ;
- une date de retour prévue est enregistrée ;
- le statut du livre est mis à jour.

Lors du retour :

- l'emprunt est mis à jour ;
- le livre redevient disponible.

L'application permet également de consulter les emprunts en cours et d'identifier les emprunts en retard.

---

### 📊 Statistiques

L'application dispose d'une partie dédiée aux statistiques permettant de suivre l'activité de la bibliothèque.

Les informations statistiques permettent notamment de consulter :

- le nombre de livres ;
- le nombre d'adhérents ;
- les emprunts ;
- les emprunts en cours ;
- les emprunts en retard ;
- les livres les plus empruntés ;
- les adhérents les plus actifs.

Ces informations sont utilisées par le tableau de bord de l'application.

---

## 🖥️ Interface utilisateur

L'interface frontend est développée avec :

- **HTML5**
- **CSS3**
- **JavaScript**

Le fichier `script.js` communique avec l'API REST à l'aide de la **Fetch API**.

L'interface comprend notamment :

- un tableau de bord ;
- une section dédiée aux auteurs ;
- une section dédiée aux livres ;
- une section dédiée aux adhérents ;
- une section dédiée aux emprunts ;
- une partie consacrée aux statistiques.

---

## 🛠️ Technologies utilisées

### Backend

- **Node.js**
- **Express.js**
- **PostgreSQL**
- **SQL**
- **dotenv**
- Middlewares Express

### Frontend

- **HTML5**
- **CSS3**
- **JavaScript**
- **Fetch API**

### Outils

- **Visual Studio Code**
- **Postman**
- **pgAdmin**
- **Git**
- **GitHub**

---

## 🏗️ Architecture du projet

Le projet est organisé de manière à séparer les différentes responsabilités du frontend et du backend.

```text
Gestion_bibliotheque/
│
├── public/
│   ├── favicon/
│   │   ├── favicon.ico
│   │   ├── favicon-16x16.png
│   │   ├── favicon-32x32.png
│   │   └── site.webmanifest
│   │
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── src/
│   ├── controllers/
│   │   ├── auteurController.js
│   │   ├── adherentController.js
│   │   ├── livreController.js
│   │   ├── empruntController.js
│   │   └── statistiqueController.js
│   │
│   ├── models/
│   │   ├── auteurModel.js
│   │   ├── adherentModel.js
│   │   ├── livreModel.js
│   │   ├── empruntModel.js
│   │   └── statistiqueModel.js
│   │
│   ├── routes/
│   │   ├── auteurRoutes.js
│   │   ├── adherentRoutes.js
│   │   ├── livreRoutes.js
│   │   ├── empruntRoutes.js
│   │   └── statistiqueRoutes.js
│   │
│   ├── middlewares/
│   │   ├── logger.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   │
│   └── server.js
│
├── database/
│   └── bibliotheque.sql
│
├── modelisation/
│   └── diagramme-UML.png
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
└── README.md