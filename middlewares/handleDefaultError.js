module.exports.handleDefaultError = (err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .json()
    .send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
};
