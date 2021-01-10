let express = require('express'),
    app = express(),
    routes = require('./routes'),
    bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get('/hello', (req, res) => {
    res.end('Hello');
});

app.use(routes);

app.use((req, res) => {
    res.status(404).json({
        message: 'Not found'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

module.exports = app;
