'use strict';
const Hapi = require('hapi');
const Blipp = require('blipp');
const Hello = require('./hello');
const server = new Hapi.Server();
require('dotenv').config();


server.connection({
  port: process.env.PORT,
  host: process.env.HOST
});

server.register([
  { register: Hello, options: {} },
  Blipp
  ],
  {
    routes: {
      prefix: '/v1'
    }
  }, (err) => {
  server.start((err) => {
    console.log(`Server running at ${server.info.uri}`);
  });
});
