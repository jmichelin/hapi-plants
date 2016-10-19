'use strict';
const Path = require('path');
const Hapi = require("hapi");
const Vision = require('vision');
const Good = require("good");
const Blipp = require("blipp");
const open = require("open");
require('dotenv').config();



const server = new Hapi.Server({
  debug: { request: ['error'] }
});

server.connection({
  port: process.env.PORT,
  host: process.env.HOST
});

server.ext('onRequest', function (request, reply) {
  console.log(`onRequest event fired for request, ${request}`);
  return reply.continue(); // continute the request life cycle
});

//return not found page if handler returns a 404
server.ext('onPostHandler', function (request, reply) {
  const response = request.response;
  if (response.isBoom && response.output.statusCode === 404) {
    return reply.file('./src/public/404.html').code(404);
  }
  return reply.continue();
});

//custom handlers
// const hello = function (name) {
//   return this.reponse({ hello: name });
// };
// server.decorate('reply', 'hello', hello);
// server.route({
//   method: 'GET',
//   path: '/{name}',
//   handler: function (request, reply) {
//     return reply.hello(request.params.name);
//   }
// });
//
// or
//
//Defines new handler for routes on this server
server.handler('hello', (route, options) => {
  return function (request, reply) {
    const hello = options.customHello || 'Hello';
    const name = request.params.name;
    return reply(`${hello} ${name}`);
  }
});

server.route({
  method: 'GET',
  path: '/{name}',
  handler: {
    hello: {
      customHello: 'Welcome'
    }
  }
});
//

server.register([require('inert'), Blipp, Vision], (err) => {
  if (err) {
    throw err;
  }
  server.views({
    engines: {
      handlebars: {
        module: require('handlebars')
      }
    },
    relativeTo: __dirname,
    path: '../src/templates'
  });

  server.route({
    method: 'GET',
    path: '/index',
    handler: function (request, reply) {
      let context = { title: 'Hapi Templates!' };
      return reply.view('index', context);
    }
  });

  //serve static html and image files
  server.route({
    method: 'GET',
    path: '/{files*}',
    handler: {
      directory: {
        path: __dirname
      }
    }
  });

  //
  //http://hapijs.com/tutorials/serving-files?lang=en_US
  // server.route({
  //   method: 'GET',
  //   path: '{param*}',
  //   config: {
  //     description: "Serving a static html file",
  //     handler: {
  //       directory: {
  //         path: Path.join(__dirname, '../src/public'), //'./src/public',
  //         listing: true,
  //         index: ['index.html']
  //       }
  //     }
  //   }
  // });
  //
  // server.route({
  //   method: 'GET',
  //   path: '/{name}',
  //   config: {
  //     description: "responding to a name parameter",
  //     handler: function (request, reply) {
  //       return reply('Hello, ' + encodeURIComponent(request.params.name) + '!');
  //     }
  //   }
  // });
  //
  server.route({
    method: 'GET',
    path: '/sample/{segment1}/{segment2}',
    config: {
      description: "This will fire when there are exactly two segments after sample",
      handler: function(request, reply) {
        return reply({ message: `At route /sample/`+encodeURIComponent(request.params.segment1)+`/`+encodeURIComponent(request.params.segment2)});
      }
    }
  });
  //
  server.route({
    method: 'GET',
    path: '/path{segment1?}/something',
    config: {
      description: "optional path parameter",
      handler: function (request, reply) {
        return reply({ message: `At route /path`+encodeURIComponent(request.params.segment1)+`/something`});
      }
    }
  });
  //
  server.route({
    method: 'GET',
    path: '/path/{segments*}',
    config: {
      description: "This will fire if there are 3 or more segments",
      handler: function (request, reply) {
        return reply({ message: `At route unlimited segments /path/`+encodeURIComponent(request.params.segments)});
      }
    }
  });
  //
  server.route({
    method: 'GET',
    path: '/path/{segments*2}',
    config: {
      description: "This will only be run when there are at max two segments after path",
      handler: function (request, reply) {
        return reply({ message: `At route only 2 /path/`+encodeURIComponent(request.params.segments)});
      }
    }
  });
  //
  server.route({
    method: '*',
    path: '/{p*}',
    handler: function (request, reply) {
      reply('The page was not found').code(404);
    }
  });
});;;

server.register({
  register: Good,
  options: {
    reporters: {
      console: [{
        module: 'good-squeeze',
        name: 'Squeeze',
        args: [{
          response: '*',
          log: '*'
        }]
      }, {
        module: 'good-console',

      }, 'stdout']
    }
  }
}, (err) => {
  if(err) {
    throw err;
  }

  server.start((err) => {
    if(err) {
      throw err;
    }
    console.log(`Server listening at: ${server.info.uri}`);
  });
});
//open('http://127.0.0.1:8080');