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

module.exports = app;
