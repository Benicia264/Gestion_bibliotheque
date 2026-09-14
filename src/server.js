console.log("Démarrage du serveur...");
const express = require('express');
const logger = require('./middlewares/logger');
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const statistiqueRoutes = require('./routes/statistiqueRoutes');
const app = express()
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(logger);
app.use(express.static('public'));
app.use('/api/livres', livreRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/auteurs', auteurRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/statistiques', statistiqueRoutes);
const server = app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
console.log("Serveur en cours d'exécution...")
