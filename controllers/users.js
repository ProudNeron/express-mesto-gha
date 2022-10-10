const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/user');
const ConflictError = require('../errors/conflict-error');
const AuthorizedButForbiddenError = require('../errors/authorized-but-forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const ValidationOrCastError = require('../errors/validation-or-cast-error');

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
        return next(new ValidationOrCastError(`Некорректный _id: ${req.params.userId} пользователя`));
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
        return next(new ValidationOrCastError(`Некорректный _id: ${req.params.userId} пользователя`));
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
      if (err.name === 'CastError') {
        return next(new ValidationOrCastError(`Некорректный _id: ${req.params.userId} пользователя`));
      }
      if (err.name === 'ValidationError') {
        return next(new ValidationOrCastError('Переданы некорректные данные для обновления профиля'));
      }
      if (err.name === 'Authorized But Forbidden') {
        return next(new AuthorizedButForbiddenError('Попытка обновить чужой профиль'));
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationOrCastError('Переданы некорректные данные при обновлении аватара'));
      }
      if (err.name === 'CastError') {
        return next(new ValidationOrCastError(`Некорректный _id: ${req.params.userId} пользователя`));
      }
      if (err.name === 'Authorized But Forbidden') {
        return next(new AuthorizedButForbiddenError('Попытка обновить чужой профиль'));
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
    .then((user) => res.send({ password, ...user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationOrCastError('Переданы некорректные данные при создании пользователя'));
      }
      return next(err);
    });
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
