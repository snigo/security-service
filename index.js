const express = require('express');
const helmet = require('helmet');
const { authRouter, serviceRouter } = require('./routes');
const logger = require('./logger');
const { setAdmin } = require('./services');

const { PORT } = process.env;

const app = express();

app.use(helmet());
app.use(express.json());
app.use('/auth', authRouter);
app.use('/service', serviceRouter);

(async () => {
  logger.info('Setting admin user...');
  await setAdmin();
  logger.info('Successfully added admin user, starting server...');
  app.listen(PORT, () => {
    logger.info(`Server is up and running on port ${PORT}`);
  });
})();
