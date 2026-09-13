console.log("Démarrage du serveur...");
const express = require('express');
const logger = require('./middlewares/logger');
const auteurRoutes = require('./routes/auteurRoutes');
const app = express()
const port = process.env.PORT || 8080;

app.use(express.json());
app.use(logger);
app.use('/api/auteurs', auteurRoutes);
const server = app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});
console.log("Serveur en cours d'exécution...")
