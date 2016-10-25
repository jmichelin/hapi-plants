/**
 * Created by jmichelin on 10/24/16.
 */
'use strict';
const Hapi = require('hapi');
const Cookie = require('hapi-auth-cookie');
const Bell = require('bell');
const Blipp = require('blipp');
const Joi = require('joi');
const routes = require('./routes');
const server = new Hapi.Server({
  debug: { request: ['error'] }
});
require('dotenv').config();

// individual non-object based
const usernameSchema = Joi.string().min(4).max(40);

//console.log(Joi.validate('john', usernameSchema));
//console.log(Joi.validate('jo', usernameSchema));

//empty string
//Joi.string().allow('');

const userSchema = Joi.object().keys({
  username: usernameSchema.required(),
  email: Joi.string().email(),
  password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/),
  meta: Joi.object()
}).xor('username', 'email');

let user = {
  username: 'John',
  email: 'email@email.com',
  password: '1qaz2wsx3edc',
  meta: { moreinfo: 'some stuff' }
};

console.log(Joi.validate( user, userSchema, { abortEarly: false }));
