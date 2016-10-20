/**
 * Created by jmichelin on 10/19/16.
 */
'use strict';
const Hapi = require('hapi');
const Cookie = require('hapi-auth-cookie');
const Bell = require('bell');
const Blipp = require('blipp');
const routes = require('./routes');
const server = new Hapi.Server({
  debug: { request: ['error'] }
});
require('dotenv').config();

server.connection({
  port: process.env.PORT,
  host: process.env.HOST
});
server.register([
  Cookie,
  Bell,
  { register: Blipp, options: { showAuth: true } }
], (err) => {

  // handle err logic

  // Acquire the clientId and clientSecret by creating a
  // twitter application at https://apps.twitter.com/app/new
  server.auth.strategy(
    'twitter',
    'bell',
    {
      provider: 'twitter',
      password: 'cookie_encryption_password_secure',
      clientId: process.env.CLIENT_ID_TWITTER,
      clientSecret: process.env.CLIENT_SECRET_TWITTER,
      isSecure: false
    }
  );

  server.auth.strategy(
    'github',
    'bell',
    {
      provider: 'github',
      password: 'cookie_encryption_password_secure',
      clientId: process.env.CLIENT_ID_GITHUB,
      clientSecret: process.env.CLIENT_SECRET_GITHUB,
      isSecure: false
    }
  );

  server.auth.strategy(
    'session',
    'cookie',
    {
      cookie: 'hapi-api',
      password: 'password-must-be-at-least-32-characters',
      isSecure: false,
      redirectTo: '/login',
      redirectOnTry: false
    }
  );

  server.route(routes);

  server.start((err) => {
    if(err) {
      throw err;
    }
    console.log(`Server running at ${server.info.uri}`);
  });
});