const server = require('./lib/server');
const pkg = require('./package.json');

process.title = pkg.name;

const shutdown = async () => {
  console.info('Gracefully shutdown in progress');
  await server.stop();
  process.exit(0);
};

process.on('SIGTERM', shutdown)
  .on('SIGINT', shutdown)
  .on('SIGHUP', shutdown)
  .on('uncaughtException', err => {
    console.error('uncaughtException caught the error: ', err);
    throw err;
  })
  .on('unhandledRejection', (err, promise) => {
    console.error(`Unhandled Rejection at: Promise ${promise} reason: ${err}`);
    throw err;
  })
  .on('exit', (code) => {
    console.info(`Node process exit with code: ${code}`);
  });

  (async () => {
    try {
      await server.start();
    } catch (err) {
      console.error('[APP] initialization failed', err);
      throw err;
    }
    console.info('[APP] initialized SUCCESSFULLY');
  })();