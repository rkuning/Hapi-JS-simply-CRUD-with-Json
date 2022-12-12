require('dotenv').config();
const Hapi = require('@hapi/hapi');

const routes = require('./routes/routes');

const { PORT, HOST, NODE_ENV } = process.env;

const init = async () => {
  const server = Hapi.server({
    port: PORT,
    host: NODE_ENV !== 'production' ? HOST : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });
  server.route(routes);
  await server.start();
  // eslint-disable-next-line no-console
  console.log(`Server already running on ${server.info.uri}`);
};

init();
