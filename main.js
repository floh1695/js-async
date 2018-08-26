'use strict';

const requestPromise = require('request-promise');

const baseUrl = 'https://swapi.co/api';

requestPromise(`${baseUrl}/people`)
  .then(response => {
    console.log(response);
  });

console.log('js-async');

