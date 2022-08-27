const Users = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => {
      res.send(users.map((j) => ({
        _id: j.id,
        name: j.name,
        about: j.about,
        avatar: j.avatar,
      })));
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      const UserNotFound = new Error(`Пользователь по указанному _id: ${req.params.userId} не найден`);
      UserNotFound.name = 'UserNotFound';
      return UserNotFound;
    })
    .then((user) => res.send({
      _id: user.id,
      name: user.name,
      about: user.about,
      avatar: user.avatar,
    }))
    .catch((err) => {
      const ERROR_CODE = 404;
      const ERROR_CODE_CAST = 400;
      if (err.name === 'UserNotFound') {
        res.status(ERROR_CODE).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_CAST).send({ message: 'Некорректный _id пользователя' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании пользователя' });
      }
      res.status(500).send({ message: err.name });
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
      const ERROR_CODE = 404;
      const ERROR_CODE_VALIDATION = 400;
      if (err.name === 'UserNotFound') {
        res.status(ERROR_CODE).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении профиля' });
        return;
      }
      res.status(500).send({ message: err.message });
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
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      const ERROR_CODE = 404;
      const ERROR_CODE_VALIDATION = 400;
      if (err.name === 'UserNotFound') {
        res.status(ERROR_CODE).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные при обновлении аватара' });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};
