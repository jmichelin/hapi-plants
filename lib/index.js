/*
Created by John Michelin
 */
'use strict';

const Hapi = require('hapi');
const Blipp = require('blipp');
const HapiMongo = require('hapi-mongodb');
const UserStore = require('./user-store.js');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
require('dotenv').config();
const server = new Hapi.Server();

server.connection({ port: process.env.PORT, host: process.env.HOST });
//mongodb://<dbuser>:<dbpassword>@ds013991.mlab.com:13991/plantsapi
const apiurl = 'mongodb://'+ process.env.MLAB_USERNAME+':'+process.env.MLAB_PASSWORD+'@ds013991.mlab.com:13991/plantsapi';
server.register([
  { register: HapiMongo, options: { url: apiurl } },
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