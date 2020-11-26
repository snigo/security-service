const logger = require('../logger');
const { sendPost } = require('../auth');
const {
  badRequest,
  forwardError,
  serverError,
} = require('./handlers');

module.exports = async (req, res) => {
  const { cid, scope } = req.body;
  if (!cid) return badRequest(res);
  try {
    const response = await sendPost('logout', { cid, scope });
    return (response.error) ? forwardError(res, response) : res.status(200).json(response);
  } catch (err) {
    logger.error(`Error while fetching response from authorization server.\nMessage: ${err}`);
    return serverError(res);
  }
};
