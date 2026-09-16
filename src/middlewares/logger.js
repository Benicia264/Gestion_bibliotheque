
const morgan = require('morgan');

const logger = morgan('dev'); // Utilisation de morgan pour le logging des requêtes HTTP

module.exports = logger;