const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: __dirname });
});

app.use(express.static(__dirname + '/src'));

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});