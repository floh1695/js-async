'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

console.log('js-async');

const baseUrl = 'https://swapi.co/api';

const getPage = page => http
  .get(`${baseUrl}/people?page=${page}`);

const getPageResults = page => getPage(page)
  .then(response => response.results);

const getFirstPage = () => getPageResults(1)
  .then(fp.map('name'))
  .then(fp.each(console.log));

const getAllPages = () => { 
  const getPageWork = pageNumber => getPage(pageNumber)
    .then(page => {
      fp(page.results)
        .map('name')
        .each(console.log);
    
      const isNextPage = !fp.isNil(page.next);
      return isNextPage
        ? getPageWork(pageNumber + 1)
        : null;
    });
  
  return getPageWork(1);
};


getAllPages();


