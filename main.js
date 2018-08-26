'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');
const stampit = require('stampit');

const getAllPeople = fp.memoize(require('./getAllPeople'));
const getAllSpeciesFromPeople = require('./getAllSpeciesFromPeople');
const print = require('./print');

print('js-async');

//* [.name] -> [String]
const mapNameThenPrint = fp.flow(
  fp.map('name'),
  fp.map(print),
);

getAllSpeciesFromPeople()
  .then(mapNameThenPrint);

fp.times(() => getAllPeople()
  .then(mapNameThenPrint))
  (5);

