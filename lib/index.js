/*
Created by John Michelin
 */
'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const HapiLevel = require('hapi-level');
const UserStore = require('./user-store.js');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
require('dotenv').config();
const server = new Hapi.Server();

server.connection({ port: process.env.PORT, host: process.env.HOST });

server.register([
  { register: HapiLevel, options: { path: './temp', config: { valueEncoding: 'json'    } } },
  UserStore,
  Blipp,
  Inert,
  Vision,
  HapiSwagger
], (err) => {

  if (err) {
    throw err;
  }

  server.start((err) => {

    if (err) {
      throw err;
    }

    console.log(`Server running at ${server.info.uri}`);
  });
});