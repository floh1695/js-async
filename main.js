'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');

console.log('js-async');

const baseUrl = 'https://swapi.co/api';

const getPeopleByPage = page => http
  .get(`${baseUrl}/people?page=${page}`);

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

  const inner = pageNumber => people => getPeopleByPage(pageNumber)
    .then(getDataFromPage)
    .then(updatePeople(people))
    .then(tail(inner(pageNumber + 1)));
  
  return inner(1)([]);
};

const getAllHairColors = () => getAllPeople()
  .then(fp.map('hair_color'))
  .then(fp.groupBy(fp.identity))
  .then(fp.mapValues('length'));

const getAllSpeciesFromPeople = () => getAllPeople()
  .then(fp.map('species'))
  .then(fp.reduce(fp.concat)([]))
  .then(fp.uniq)
  .then(fp.map(http.get))
  .then(promises => Promise.all(promises));

const print = x => {
  console.log(x);
  return x;
};

getAllSpeciesFromPeople()
  .then(fp.map('name'))
  .then(fp.each(print));

