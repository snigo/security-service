const { sendPut } = require('../auth');
const logger = require('../logger');
const { badRequest, serverError, forwardError } = require('./handlers');

const updateCtrl = (endpoint) => async (req, res) => {
  try {
    const {
      email,
      password,
      old,
      cid,
    } = req.body;
    if (!email || !password || !old || !cid) return badRequest(res);
    const user = await sendPut(endpoint, {
      email,
      password,
      old,
      cid,
    });
    if (user.error) return forwardError(res, user);

    return res.status(200).json({ user });
  } catch (err) {
    logger.error(`Error while fetching response from authorization server.\nMessage: ${err}`);
    return serverError(res);
  }
};

exports.updateEmailCtrl = updateCtrl('email');
exports.updatePasswordCtrl = updateCtrl('password');
