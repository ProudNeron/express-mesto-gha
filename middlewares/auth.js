const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/authorized-but-forbidden-error');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports.auth = (req, res, next) => {
  const bearerToken = req.headers.authorization;
  console.log(bearerToken);

  if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
    return next(new UnauthorizedError('некорректный токен'));
  }

  const token = extractBearerToken(bearerToken);

  let payload = null;

  try {
    payload = jwt.verify(token, 'superSecret');
  } catch (err) {
    const unauthorizedError = new UnauthorizedError('невалидный токен');
    unauthorizedError.name = err.name;
    return unauthorizedError;
  }

  req.user = payload;

  return next();
};
