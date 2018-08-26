'use strict';

const fp = require('lodash/fp');

const getAllPeople = require('./getAllPeople');

//* () -> Promise [{ String: Number }]
const getAllHairColors = () => getAllPeople()
  .then(fp.map('hair_color'))
  .then(fp.groupBy(fp.identity))
  .then(fp.mapValues('length'));

module.exports = getAllHairColors;

