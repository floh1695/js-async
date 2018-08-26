'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

const getAllPeople = require('./getAllPeople');

//* () -> Promise [Species]
const getAllSpeciesFromPeople = () => getAllPeople()
  .then(fp.flow(
    //* People -> [[Url Species]]
    fp.map('species'),
    //* [[Url Species]] -> [Url Species]
    fp.flatten,
    //* [Url Species] -> [Url Species]
    fp.uniq,
    //* [Url Species] -> [Promise Species]
    fp.map(http.get),
    //* [Promise Species] -> Promise [Species]
    promises => Promise.all(promises),
  ));

module.exports = getAllSpeciesFromPeople;

