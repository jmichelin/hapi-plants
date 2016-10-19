'use strict';
const Hapi = require('hapi');
const Blipp = require('blipp');
const HapiLevel = require('hapi-level');
const HapiSwagger = require('hapi-swagger');
const Inert = require('inert');
const Vision = require('vision');
const Glue = require('glue');
const UserStore = require('./user-store');
require('dotenv').config();


const manifest = {
  server: {},
  connections: [
    {port: process.env.PORT, host: process.env.HOST}
  ],
  registrations: [
    {
      plugin: {
        register: 'hapi-level',
        options: {
          path: './temp',
          conifig: { valueEncoding: 'json' }
        }
      }
    },
    {
      plugin: {
        register: 'blipp',
        options: {}
      }
    },
    {
      plugin: {
        register: './user-store.js',
        options: {}
      }
    }
    // ,
    // { 'hapi-level': { path: './temp', config: { valueEncoding: 'json' } } },
    // { './user-store.js': {} },
    // { 'blipp': {} }
  ]
};
Glue.compose(manifest, { relativeTo: __dirname }, (err, server) => {
  server.start((err) => {
    console.log(`Server running at ${server.info.uri}`);
  })
});

// server.register([
//   Inert,
//   Vision,
//     {
//       register: HapiLevel, options: {
//         config: { valueEncoding: 'json' }
//       }
//     },
//     {
//       register: HapiSwagger,
//       options: {
//         info: {
//           title: 'Test API Documentation'
//         }
//       }
//     },
//     { register: Hello, options: {} },
//     UserStore,
//     Blipp
//   ],
//   {
//     routes: {
//       prefix: '/v1'
//     }
//   }, (err) => {
//   server.start((err) => {
//     console.log(`Server running at ${server.info.uri}`);
//   });
// });
