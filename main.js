'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

console.log('js-async');

const baseUrl = 'https://swapi.co/api';

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

//* () -> Promise [{ String: Number }]
const getAllHairColors = () => getAllPeople()
  .then(fp.map('hair_color'))
  .then(fp.groupBy(fp.identity))
  .then(fp.mapValues('length'));

//* () -> Promise Species
const getAllSpeciesFromPeople = () => getAllPeople()
  .then(fp.map('species'))
  .then(fp.reduce(fp.concat)([]))
  .then(fp.uniq)
  .then(fp.map(http.get))
  .then(promises => Promise.all(promises));

//* a -> a
const print = x => {
  console.log(x);
  return x;
};

getAllSpeciesFromPeople()
  .then(fp.map('name'))
  .then(fp.each(print));

