'use strict';
var expect = require('chai').expect;
var request = require('request');


describe('Server Basic Features', function () {
  let url = 'http://localhost:8080/';
  it("returns status 200", function () {
    request(url, function (error, response, body) {
      expect(response.statusCode).to.equal(200);
    });
  });
});