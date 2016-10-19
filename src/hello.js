/**
 * Created by jmichelin on 10/18/16.
 */
exports.register = function (server, options, next) {
  // server.dependency('database', (server, after) => {
  //   //can do some dependency logic here.
  //   return after();
  // });
  //
  const getHello = function (name) {
    const target = name || 'world';
    return `Hello ${target}`;
  };
  server.expose({ getHello: getHello }); //server.plugins.hello.getHello('John'); returns 'hello John'
  server.route({
    method: 'GET',
    path: '/hello/{name?}',
    handler: function (request, reply) {
      const message = getHello(request.params.name);
      return reply(message);
    }
  });
  return next();
};

exports.register.attributes = {
  name: 'hello'
};