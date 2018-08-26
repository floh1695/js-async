'use strict';

const fp = require('lodash/fp');
const http = require('request-promise-json');
const stampit = require('stampit');

const getAllPeople = fp.memoize(require('./getAllPeople'));
const getAllSpeciesFromPeople = require('./getAllSpeciesFromPeople');
const print = require('./print');

const baseUrl = require('./baseUrl');

const Api = stampit()
  .props({
    //* String
    url: null,
  })
  .methods({
    //* Api ~> () -> Promise response
    get: function () {
      return http
        .get(this.url);
    },
  });

const PeopleApi = stampit(Api)
  .init(function ({
    options = {
      page: 1.
    },
  }) {
    this.url = baseUrl 
      + '/people'
      + `?page=${options.page}`;
  })
  .methods({
    //* PeopleApi ~> Number -> PeopleApi
    page: function (pageNumber) {
      return PeopleApi({ 
        options: { 
          page: pageNumber, 
        }, 
      });
    },
  });

const SwApi = stampit(Api)
  .init(function ({}) {
    this.url = baseUrl;
  })
  .methods({
    //* SwApi ~> () -> PeopleApi 
    people: function () {
      return PeopleApi();
    },
  });


print('js-async');
print('--------');

//* [.name] -> [String]
const mapNameThenPrint = fp.flow(
  fp.map('name'),
  fp.map(print),
);

//getAllSpeciesFromPeople()
//  .then(mapNameThenPrint);

//fp.times(() => getAllPeople()
//  .then(mapNameThenPrint))
//  (5);

SwApi()
  .people()
  .page(2)
  .get()
  .then(page => page.results)
  .then(mapNameThenPrint);

