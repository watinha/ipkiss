let express = require('express'),
    app = express();

app.get('/hello', (req, res) => {
    res.end('Hello');
});

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
