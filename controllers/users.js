const Users = require('../models/user');
const { ERR_CODE_DEFAULT, ERR_CODE_NOT_FOUND, ERR_CODE_CAST } = require('../utils/errstatus');

module.exports.getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => res.status(ERR_CODE_DEFAULT).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      const UserNotFound = new Error(`Пользователь по указанному _id: ${req.params.userId} не найден`);
      UserNotFound.name = 'UserNotFound';
      return UserNotFound;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_CAST).send({ message: 'Некорректный _id пользователя' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_CAST).send({ message: 'Переданы некорректные данные при создании пользователя' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.name });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      const UserNotFound = new Error(`Пользователь по указанному _id: ${req.user._id} не найден`);
      UserNotFound.name = 'UserNotFound';
      return UserNotFound;
    })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_CAST).send({ message: 'Некорректный _id пользователя' });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_CAST).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      const UserNotFound = new Error(`Пользователь по указанному _id: ${req.user._id} не найден`);
      UserNotFound.name = 'UserNotFound';
      return UserNotFound;
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_CAST).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_CAST).send({ message: 'Некорректный _id пользователя' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};
