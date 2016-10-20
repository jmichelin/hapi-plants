/**
 * Created by jmichelin on 10/19/16.
 */
'use strict';
const Hapi = require('hapi');
const Basic = require('hapi-auth-basic');
const Blipp = require('blipp');
const routes = require('./routes');
const server = new Hapi.Server();
require('dotenv').config();

server.connection({
  port: process.env.PORT,
  host: process.env.HOST
});
server.register([
  Basic,
  { register: Blipp, options: { showAuth: true } }
], (err) => {
  const basicConfig = {
    validateFunc: function (request, username, password, callback) {
      if (username !== 'admin' || password !== 'password') {
        return callback(null, false);
      }
      return callback(null, true, { username: 'admin' });
    }
  };
  server.auth.strategy('simple', 'basic', basicConfig);
  server.auth.default('simple');
  server.route(routes);
  server.start((err) => {
    if(err) {
      throw err;
    }
    console.log(`Server listening at: ${server.info.uri}`);
  });
});
// module.exports = server;