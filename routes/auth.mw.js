const { sendPost, sign, verify } = require('../utils');

exports.signupMW = async (req, res, next) => {
  const pid = req.headers['x-consumer-id'];
  const { email, password } = req.body;
  res.user = await sendPost('signup', { email, password, pid });
  res.user.token = sign(pid, res.user.secret);
  next();
};

exports.authMW = async (req, res, next) => {
  const pid = req.headers['x-consumer-id'];
  const cid = req.headers['x-client-id'];
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(/\s+/)[1] : null;
  if (!pid || !cid || !token) return res.sendStatus(401);
  const user = await sendPost('auth', { cid, pid });
  try {
    const result = await verify(token, user.pid, user.secret);
    if (!result) return res.sendStatus(401);
  } catch (_) {
    res.sendStatus(401);
  }
  res.user = { cid, pid, token };
  return next();
};
