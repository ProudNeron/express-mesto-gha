const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');
const UnauthorizedError = require('../errors/unauthorized-error');
const ValidationOrCastError = require('../errors/validation-or-cast-error');
const { validateUrl } = require('../utils/utils');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (email) => validator.isEmail(email),
      message: (props) => `${props.value} не является почтовым адрессом`,
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (url) => validateUrl(url),
      message: (props) => `${props.value} некорректная ссылка на изображение`,
    },
  },
});

userSchema.statics.findUserByCredentials = function ({ email, password }) {
  if (!validator.isEmail(email)) {
    throw new ValidationOrCastError('Неправильные почта или пароль');
  }
  return this.findOne({ email }).select('+password')
    .orFail(new UnauthorizedError('Неправильные почта или пароль'))
    .then((user) => bcrypt.compare(password, user.password)
      .then((match) => {
        if (!match) {
          throw new UnauthorizedError('Неправильные почта или пароль');
        }

        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
