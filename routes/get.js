const fs = require('fs');
const path = require('path');
const express = require('express');

const getRouter = express.Router();
const data = require('../Static/data.json');

const organise = dataArray =>
  dataArray
    .map(datum => ({
      ...datum,
      title: datum.title.startsWith('The ')
        ? `${datum.title.substring(4)}, The`
        : datum.title,
    }))
    .sort((datumA, datumB) => (datumA.title > datumB.title ? 1 : -1));

getRouter.use('/books', (req, res) => {
  res.send(interpolateData('GET/get-books.html', organise(data.books)));
});

getRouter.use('/movies', (req, res) => {
  res.send(interpolateData('GET/get-movies.html', organise(data.movies)));
});

getRouter.use('/tv', (req, res) => {
  res.send(interpolateData('GET/get-tv.html', organise(data.tv)));
});

function interpolateData(fragmentFile, dataset) {
  const fragment = fs.readFileSync(
    path.join(__dirname, `../static/${fragmentFile}`),
    { encoding: 'utf8', flag: 'r' }
  );

  const patterns = fragment.match(
    /(?<template><template>(?<pattern>.*)<\/template>)/
  );
  const { template = '', pattern = '' } = patterns?.groups || {};
  const tokens = pattern
    .match(/\{([^}]*)}/g)
    .map(token => token.replace(/(^{)|(}$)/g, ''));
  const replaceTokens = tokenReplace(pattern, tokens);

  return fragment.replace(
    template,
    [dataset].flat().map(replaceTokens).join('\n  ')
  );
}

function tokenReplace(pattern, tokens) {
  return datum =>
    tokens.reduce(
      (_pattern, token) =>
        _pattern.replaceAll(RegExp(`{${token}}`, 'g'), datum[token]),
      pattern
    );
}

module.exports = getRouter;
