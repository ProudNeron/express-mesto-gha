module.exports.handleDefaultError = (err, req, res) => {
  const { statusCode = 500, message } = err;

  res.status(err.statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};
