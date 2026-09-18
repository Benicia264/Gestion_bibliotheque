
const express = require('express');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const pool = require('./config/db');
const auteurRoutes = require('./routes/auteurRoutes');
const adherentRoutes = require('./routes/adherentRoutes');
const livreRoutes = require('./routes/livreRoutes');
const empruntRoutes = require('./routes/empruntRoutes');
const statistiqueRoutes = require('./routes/statistiqueRoutes');
const app = express()
const port = process.env.PORT || 8080;

app.use(express.json())
app.use(logger);
app.use(express.static('public'));
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({ status: 'ok', database: 'up' });
    } catch (err) {
        res.status(503).json({ status: 'error', database: 'down', message: err.message });
    }
});
app.use('/api/livres', livreRoutes);
app.use('/api/adherents', adherentRoutes);
app.use('/api/auteurs', auteurRoutes);
app.use('/api/emprunts', empruntRoutes);
app.use('/api/statistiques', statistiqueRoutes);
app.use(errorHandler);
const server = app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});

