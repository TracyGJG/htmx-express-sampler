const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const postRoutes = require('./routes/post');
const getRoutes = require('./routes/get');
const PageRoute = require('./routes/pageRouter.js');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set(express.static(path.join(__dirname, 'views')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});
app.get('/home', (_req, res) => {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});

app.use('/post', postRoutes);
app.use('/get', getRoutes);
app.use('/page', PageRoute);

app.listen(PORT);
console.log('Listening on ', PORT);
console.log('http://localhost:' + PORT + '/');
