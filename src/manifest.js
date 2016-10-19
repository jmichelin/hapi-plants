/**
 * Created by jmichelin on 10/19/16.
 */
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
  ]
};

modules.exports = manifest;