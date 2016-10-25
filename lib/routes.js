'use strict';

const Joi = require('joi');

const usernameSchema = Joi.string().min(4).max(40);

const userSchema = Joi.object().keys({
  username: usernameSchema.required(),
  email: Joi.string().email(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  meta: Joi.object()
}).xor('username', 'email');

module.exports = [
  {
    method: 'POST',
    path: '/user',
    config: {
      validate: {
        params: false,
        query: false,
        payload: userSchema
      },
      handler: function (request, reply) {
        console.log('request', request);
        return reply(`Create a user`);
      },
      description: "Create a user"
    }
  },
  {
    method: 'GET',
    path: '/user/{userId}',
    config: {
      validate: {
        headers: true,
        params: {
          userId: Joi.string().min(4).max(40).required()
        },
        query: false
      },
      handler: function (request, reply) {

       return reply(`userid is ${request.params.userId}`);
      },
      response: {
        schema: Joi.object().keys({
          id: Joi.string().min(4).max(40),
          details123: Joi.object()
        }),
        sample: 100,
        failAction: 'error'
      }
    }
  },
  {
    method: 'GET',
    path: '/auth/github',
    config: {
      auth: 'github', //<-- use our twitter strategy and let bell take over
      handler: function(request, reply) {

        if (!request.auth.isAuthenticated) {
          return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
        }

        //Just store a part of the github profile information in the session as an example. You could do something
        //more useful here - like loading or setting up an account (social signup).
        const profile = request.auth.credentials.profile;

        request.cookieAuth.set({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName,
          authorizedProfile: profile
        });

        return reply.redirect('/github');
      }
    }
  },
  {
    method: 'GET',
    path: '/auth/twitter',
    config: {
      auth: 'twitter', //<-- use our twitter strategy and let bell take over
      handler: function(request, reply) {

        if (!request.auth.isAuthenticated) {
          return reply(Boom.unauthorized('Authentication failed: ' + request.auth.error.message));
        }

        //Just store a part of the twitter profile information in the session as an example. You could do something
        //more useful here - like loading or setting up an account (social signup).
        const profile = request.auth.credentials.profile;

        request.cookieAuth.set({
          twitterId: profile.id,
          username: profile.username,
          displayName: profile.displayName
        });

        return reply.redirect('/twitter');
      }
    }
  },
  {
    method: 'GET',
    path: '/login',
    config: {
      auth: {
        strategies: ['twitter','github']
      },
      handler: function (request, reply) {

        if (!request.auth.isAuthenticated) {
          request.cookieAuth.clear();
          console.log('request\n', request);
          return reply('Authentication failed due to');
        }

        request.cookieAuth.set({
          username: request.auth.credentials.profile.username
        });

        return reply.redirect('/private');
      }
    }
  },
  {
    method: 'GET',
    path: '/logout',
    config: {
      handler: function (request, reply) {

        request.cookieAuth.clear();

        return reply(`<pre>`+JSON.stringify(request.auth, null, 4)+`</pre>`);
      }
    }
  },
  {
    method: 'GET',
    path: '/github',
    config: {
      auth: {
        mode: 'try',
        strategy: 'session'
      },
      handler: function (request, reply) {
        return reply(`<pre>`+JSON.stringify(request.auth, null, 4)+`</pre>`);
      }
    }
  },
  {
    method: 'GET',
    path: '/twitter',
    config: {
      auth: 'session',
      handler: function (request, reply) {
        return reply(`<pre>`+JSON.stringify(request.auth, null, 4)+`</pre>`);
      }
    }
  }
];