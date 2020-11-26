const logger = require('../logger');
const {
  sendPost,
  maskText,
  signToken,
  sendDelete,
  sendPut,
} = require('../auth');
const { badRequest, serverError, forwardError } = require('./handlers');
const { setToken, deleteToken } = require('../cache');

exports.requestResetCtrl = async (req, res) => {
  const { email } = req.body;
  if (!email) return badRequest(res);
  try {
    const user = await sendPost('reset', { email });
    if (user.error) return forwardError(res, user);
    try {
      const token = await signToken(user.pid, user.secret);
      setToken({ cid: user.cid, token });

      /**
       * emailer.send('reset', { pid: user.pid, cid: user.cid, token });
       */
      return res.status(200).json({ message: `Reset link was sent to the email: ${maskText(user.email, 2, 5)}.` });
    } catch (err) {
      logger.error(`JWT encryption error for userid: ${user.pid}\nMessage: ${err}`);
      return serverError(res);
    }
  } catch (err) {
    return serverError(res);
  }
};

exports.revokeRequestCtrl = async (req, res) => {
  try {
    const { cid } = req.body;
    if (!cid) return badRequest(res);
    const [authResponse, cacheResponse] = await Promise.all([sendDelete('reset', { cid }), deleteToken({ cid })]);
    if (authResponse.error) return forwardError(res, authResponse);
    if (cacheResponse.error) return forwardError(res, cacheResponse);
    return res.status(200).json(authResponse);
  } catch (err) {
    return serverError(res);
  }
};

exports.resetPasswordCtrl = async (req, res) => {
  const { password, pid, cid } = req.body;
  if (!password || !pid || !cid) return badRequest(res);
  try {
    const response = await sendPut('reset', { password, pid, cid });
    if (response.error) return forwardError(res, response);
    deleteToken({ cid });
    return res.status(200).json(response);
  } catch (err) {
    logger.error(`Error while connecting to authorization service.\nMessage: ${err}`);
    return serverError(res);
  }
};
