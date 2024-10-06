'use strict';

const app = require('./app');

const PORT=3000;

// Creacion del Servidor
app.listen(PORT, (err) => {
    if (err) {
        console.error(`Could not connect to Port ${PORT}`, err);
    } else {
        console.log(`Server running on port ${PORT}`);
    }
});

