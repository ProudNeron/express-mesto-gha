const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const NotFoundError = require('../errors/not-found-error');
const CastError = require('../errors/cast-error');

module.exports.getAllUsers = (req, res, next) => {
  Users.find({})
    .then((users) => {
      res.send(users);
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  Users.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError(`Некорректный _id: ${req.params.userId} пользователя`));
      }
      return next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден`);
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError(`Некорректный _id: ${req.params.userId} пользователя`));
      }
      return next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден`);
    })
    .then((user) => res.send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Переданы некорректные данные при обновлении профиля'));
      }

      if (err.name === 'CastError') {
        return next(new CastError(`Некорректный _id: ${req.params.userId} пользователя`));
      }

      return next(err);
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(() => {
      throw new NotFoundError(`Пользователь по указанному _id: ${req.params.userId} не найден`);
    })
    .then((user) => res.send(user))
    .catch((user) => res.send(user))

    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new CastError('Переданы некорректные данные при обновлении аватара'));
      }

      if (err.name === 'CastError') {
        return next(new CastError(`Некорректный _id: ${req.params.userId} пользователя`));
      }

      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  Users.findOne({ email })
    .then((user) => {
      if (user) {
        throw new ConflictError('Переданы некорректные данные при создании пользователя');
      }
    })
    .catch(next);

  bcrypt.hash(password, 10)
    .then((hash) => Users.create({
      password: hash, email, name, about, avatar,
    }))
    .then(() => {
      res.send({
        email, name, about, avatar,
      });
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'superSecret', { expiresIn: '7d' });
      res.send({ token });
    })
    .catch(next);
};
