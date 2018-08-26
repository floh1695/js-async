'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

console.log('js-async');

const baseUrl = 'https://swapi.co/api';
http.get(`${baseUrl}/people`)
  .then(response => response.results)
  .then(fp.map('name'))
  .then(fp.each(console.log));

