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

    it("Should return Hello World", function () {
      request(url, function (error, response, body) {
        console.log('body', body);
        expect(body).to.equal('Hello World');
      });
    });

});