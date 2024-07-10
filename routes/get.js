const fs = require('fs');
const path = require('path');
const express = require('express');

const getRouter = express.Router();
const data = require('../Static/data.json');

const organise = stringArray =>
  stringArray
    .map(str => (str.startsWith('The ') ? `${str.substring(4)}, The` : str))
    .sort();

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
    path.join(__dirname, `../Static/${fragmentFile}`),
    { encoding: 'utf8', flag: 'r' }
  );

  const patterns = fragment.match(
    /(?<pattern><template data-key="(?<dataKey>[^"]*)">(?<template>.*)<\/template>)/
  );
  const { dataKey, template = '', pattern = '' } = patterns?.groups || {};
  const sections = template.split(`\${${dataKey}}`);

  return fragment.replace(
    pattern,
    [dataset]
      .flat()
      .map(datum => sections.join(datum))
      .join('\n  ')
  );
}

module.exports = getRouter;
