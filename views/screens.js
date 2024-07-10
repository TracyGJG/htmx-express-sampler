const express = require('express');
const PageRouter = express.Router();
var path = require('path');

PageRouter.use('/post', (req, res) => {
  res.sendFile(path.join(__dirname, '../Static/Post/post.html'));
});

PageRouter.use('/get', (req, res) => {
  res.sendFile(path.join(__dirname, '../Static/Get/get.html'));
});

module.exports = PageRouter;
