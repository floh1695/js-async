'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

const baseUrl = require('./baseUrl');

//* Number -> Promise -> PeoplePage
const getPeopleByPage = page => http
  .get(`${baseUrl}/people?page=${page}`);

//* () -> Promise People
const getAllPeople = () => {
  //* PeoplePage -> Data
  const getDataFromPage = page => ({
      people: page.results,
      isNextPage: !fp.isNil(page.next),
    });
 
  //* People -> Data -> Data
  const updatePeople = people => data => fp.assign(data)
    ({
      people: fp.concat(people)(data.people),
    });

  //* (People -> People)
  const tail = recurse => data => data.isNextPage
    ? recurse(data.people)
    : data.people;

  //* Number -> People -> Promise People
  const inner = pageNumber => people => getPeopleByPage(pageNumber)
    .then(getDataFromPage)
    .then(updatePeople(people))
    .then(tail(inner(pageNumber + 1)));
  
  return inner(1)([]);
};

module.exports = getAllPeople;

