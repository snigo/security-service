const logger = require('../logger');
const { sendPost, signToken } = require('../utils');
const {
  badRequest,
  forwardError,
  serverError,
} = require('./handlers');

module.exports = async (req, res) => {
  const { email, password, pid } = req.body;
  if (!email || !password || !pid) return badRequest(res);
  try {
    const user = await sendPost('signup', { email, password, pid });
    if (user.error) return forwardError(res, user);
    try {
      const token = await signToken(pid, user.secret);
      return res.status(200).json({ pid, cid: user.cid, token });
    } catch (err) {
      logger.error(`JWT encryption error for userid: ${pid}\nMessage: ${err}`);
      return serverError(res);
    }
  } catch (err) {
    logger.error(`Error while fetching response from authorization server.\nMessage: ${err}`);
    return serverError(res);
  }
};
