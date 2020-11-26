const logger = require('../logger');
const { sendPost, signToken } = require('../auth');
const {
  badRequest,
  forwardError,
  serverError,
} = require('./handlers');

module.exports = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return badRequest(res);
  try {
    const user = await sendPost('login', { email, password });
    if (user.error) return forwardError(res, user);
    try {
      const token = await signToken(user.pid, user.secret);
      return res.status(200).json({ pid: user.pid, cid: user.cid, token });
    } catch (err) {
      logger.error(`JWT encryption error for userid: ${user.pid}\nMessage: ${err}`);
      return serverError(res);
    }
  } catch (err) {
    logger.error(`Error while fetching response from authorization server.\nMessage: ${err}`);
    return serverError(res);
  }
};
