const jwt = require('jsonwebtoken');

exports.signToken = (pid, secret) => jwt.sign({ pid }, secret);

exports.verifyToken = (token, pid, secret) => new Promise((res, rej) => {
  try {
    jwt.verify(token, secret, (err, decoded) => {
      if (err) rej(err);
      else res(decoded.pid === pid);
    });
  } catch (err) {
    rej(err);
  }
});
