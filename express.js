const express = require('express');
const app = express();
const path = require('path');

const PORT = process.env.PORT || 30000;

app.use( express.static('dist') );

app.get('/', (req, res) => {
    res.sendFile( path.join(__dirname + '/dist/index.html') );
});

app.get('/playground', (req, res) => {
    res.sendFile( path.join(__dirname + '/dist/playground.html') );
});

app.listen(PORT, () => {
    console.log(`Earworm is waiting for your orders at http://localhost:${PORT}`);
    console.log(`Go to http://localhost:${PORT}/playground to check available sounds.`);
});