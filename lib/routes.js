'use strict';

module.exports = [
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