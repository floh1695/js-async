'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

const getAllPeople = require('./getAllPeople');

//* () -> Promise Species
const getAllSpeciesFromPeople = () => getAllPeople()
  .then(fp.map('species'))
  .then(fp.reduce(fp.concat)([]))
  .then(fp.uniq)
  .then(fp.map(http.get))
  .then(promises => Promise.all(promises));

module.exports = getAllSpeciesFromPeople;

