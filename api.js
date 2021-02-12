const OpenAPIBackend = require('openapi-backend').default;

const api = new OpenAPIBackend({ definition: './openapi.yaml' });

module.exports = api;
