const logger = require('../logger');
const { sendPost, verifyToken, sendPut } = require('../utils');
const {
  badRequest,
  forwardError,
  serverError,
  invalidCredentials,
} = require('./handlers');

module.exports = async (req, res) => {
  const { pid, cid, token } = req.body;
  if (!pid || !cid || !token) return badRequest(res);
  try {
    const user = await sendPost('auth', { cid, pid });
    if (user.error) return forwardError(res, user);
    try {
      const result = await verifyToken(token, pid, user.secret);
      if (!result) return invalidCredentials(res);
      sendPut('auth', { cid });
      return res.status(200).json({ pid, cid, token });
    } catch (err) {
      logger.error(`JWT encryption error for token: ${token}\nMessage: ${err}`);
      return invalidCredentials(res);
    }
  } catch (err) {
    logger.error(`Error while fetching response from authorization server.\nMessage: ${err}`);
    return serverError(res);
  }
};
