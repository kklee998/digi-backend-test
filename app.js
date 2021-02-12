const express = require('express');
const logger = require('morgan');
const swaggerUi = require('swagger-ui-express');
const yaml = require('js-yaml');
const fs = require('fs');
const cors = require('cors');
const jwt = require('./jwt');
const api = require('./api');
const {
  userListHandler, userCreateHandler, userLoginHandler,
} = require('./handlers');

const swaggerDocument = yaml.load(fs.readFileSync('./openapi.yaml', 'utf8'));

api.register({
  apiRoot: (c, req, res) => res.status(200).json({ message: 'Welcome to API root' }),
  userList: userListHandler,
  userCreate: userCreateHandler,
  userLogin: userLoginHandler,
  validationFail: (c, req, res) => res.status(400).json({ err: c.validation.errors }),
  notFound: (c, req, res) => res.status(404).json({ err: 'not found' }),
  unauthorizedHandler: (c, req, res) => res.status(401).json({ err: 'Please login' }),
});

// eslint-disable-next-line no-unused-vars
api.registerSecurityHandler('jwtAuth', (c, req, res) => {
  const authHeader = c.request.headers.authorization;
  if (!authHeader) {
    throw new Error('Missing authorization header');
  }
  const token = authHeader.replace('Bearer ', '');
  return jwt.verify(token);
});

api.init();

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use((req, res) => api.handleRequest(req, req, res));

module.exports = app;
