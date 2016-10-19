/**
 * Created by jmichelin on 10/18/16.
 */
const Uuid = require('uuid');
const Boom = require('boom');
exports.register = function (server, options, next){
  let store;
  server.dependency('hapi-level', (server, after) => {
    store = server.plugins['hapi-level'].db;
    return after();
  });
  const getUser = function (userId, callback) {
    return store.get(userId, callback);
  };
  const createUser = function (userDetails, callback) {
    const userId = Uuid.v4();
    const user = {
      id: userId,
      details: userDetails
    };
    store.put(userId, user, (err) => {
      callback(err, user);
    });
  };
  const updateUser = function(userId, details, callback) {
    store.get(userId, function (err, user) {
      if (err) {
        callback(err, user);
      }
      let updateUser = {};
      updateUser.id = userId;
      updateUser.details = Object.assign({}, user.details, details);
      store.put(userId, updateUser, (err) => {
        callback(err, updateUser);
      });
    });
  };
  const deleteUser = function (userId, callback) {
    return store.del(userId, callback);
  };
  server.route([
    {
      method: 'GET',
      path: '/user/{userId}',
      config: {
        handler: function (request, reply) {
          const userId = request.params.userId;
          getUser(userId, (err, user) => {
            if(err) {
              return reply(Boom.notFound(err));
            }
            return reply(user);
          });
        },
        description: 'Retrieve a user',
        tags: ['api']
      }
    },
    {
      method: 'POST',
      path: '/user',
      config: {
        handler: function (request, reply) {
          const userDetails = request.payload;
          createUser(userDetails, (err, user) => {
            if(err) {
              return reply(Boom.badRequest(err));
            }
            return reply(user);
          });
        },
        description: 'Create a user',
        tags: ['api']
      }
    },
    {
      method: 'PUT',
      path: '/user/{userId}',
      config: {
        handler: function (request, reply) {
          const userInfo = request.payload;
          let userId = request.params.userId;
          updateUser(userId, userInfo, (err, user) => {
            if(err) {
              return reply(Boom.badRequest(err));
            }
            return reply(user);
          });
        },
        description: 'Update a user',
        tags: ['api']
      }
    },
    {
      method: 'DELETE',
      path: '/user/{userId}',
      config: {
        handler: function (request, reply) {
          let userId = request.params.userId;
          deleteUser(userId, (err) => {
            if(err) {
              return reply(Boom.badRequest(err));
            }
            return reply(`User information for ${userId} has been deleted`);
          });
        },
        description: 'Delete a user',
        tags: ['api']
      }
    }
  ]);
  server.expose({
    getUser: getUser,
    createUser: createUser,
    updateUser: updateUser,
    deleteUser: deleteUser
  });
  return next();
};
exports.register.attributes = {
  name: 'userStore'
};