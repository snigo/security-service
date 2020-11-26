const Redis = require('ioredis');
const logger = require('../logger');

const {
  REDIS_CONNECTION_URL,
  REDIS_PREFIX,
  ADMIN_ID,
  ADMIN_KEY,
} = process.env;

const redis = new Redis(REDIS_CONNECTION_URL);

const setService = async ({
  spid,
  label,
  key,
  scope,
}) => {
  try {
    const service = {
      spid,
      key,
      label,
      scope,
      created_at: new Date().toISOString(),
    };
    const response = await redis.hmset(`${REDIS_PREFIX}-${spid}`, service);
    if (response !== 'OK') {
      logger.error(response);
      return { error: response };
    }
    return service;
  } catch (err) {
    logger.error(err);
    return { error: err };
  }
};

const setAdmin = async () => {
  try {
    await setService({
      spid: ADMIN_ID,
      label: 'Root admin',
      key: ADMIN_KEY,
      scope: 'root',
    });
    return { message: 'OK' };
  } catch (err) {
    logger.error(`Error setting up root admin.\nMessage: ${err}`);
    return { error: err };
  }
};

const verify = async ({ spid, key, scope = 'service' }) => {
  try {
    const service = await redis.hgetall(`${REDIS_PREFIX}-${spid}`);
    return !!(
      service
      && service.key === key
      && (service.scope === scope || service.scope === 'admin' || service.scope === 'root')
    );
  } catch (err) {
    logger.error(`Failed during service verification.\nMessage: ${err}`);
    return { error: err };
  }
};

const revokeService = async ({ spid }) => {
  try {
    const service = await redis.hgetall(`${REDIS_PREFIX}-${spid}`);
    if (service.scope === 'root') return false;
    const result = await redis.del(`${REDIS_PREFIX}-${spid}`);
    return result;
  } catch (err) {
    logger.error(`Error while revoking a service.\nMessage: ${err}`);
    return { error: err };
  }
};

const setToken = async ({ cid, token }) => {
  try {
    const result = await redis.set(`${REDIS_PREFIX}-${cid}`, token);
    return result;
  } catch (err) {
    logger.error(`Error while caching a token.\nMessage: ${err}`);
    return { error: err };
  }
};

const getToken = async ({ cid }) => {
  try {
    const token = await redis.set(`${REDIS_PREFIX}-${cid}`);
    return token;
  } catch (err) {
    logger.error(`Error while caching a token.\nMessage: ${err}`);
    return { error: err };
  }
};

const hasToken = async ({ cid }) => {
  try {
    const exists = await redis.exists(`${REDIS_PREFIX}-${cid}`);
    return !!exists;
  } catch (err) {
    logger.error(`Error while caching a token.\nMessage: ${err}`);
    return { error: err };
  }
};

const deleteToken = async ({ cid }) => {
  try {
    const result = await redis.del(`${REDIS_PREFIX}-${cid}`);
    return result;
  } catch (err) {
    logger.error(`Error while deleting a token.\nMessage: ${err}`);
    return { error: err };
  }
};

module.exports = {
  setAdmin,
  setService,
  revokeService,
  verify,
  setToken,
  getToken,
  hasToken,
  deleteToken,
};
