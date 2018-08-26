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

const getAllPeople = () => {
  const getDataFromPage = page => ({
      people: page.results,
      isNextPage: !fp.isNil(page.next),
    });
 
  const updatePeople = people => data => fp.assign(data)
    ({
      people: fp.concat(people)(data.people),
    });

  const tail = recurse => data => data.isNextPage
    ? recurse(data.people)
    : data.people;

  const inner = pageNumber => people => getPage(pageNumber)
    .then(getDataFromPage)
    .then(updatePeople(people))
    .then(tail(inner(pageNumber + 1)))
  
  return inner(1)([]);
};


getAllPeople()
  .then(fp.map('name'))
  .then(fp.each(console.log));

