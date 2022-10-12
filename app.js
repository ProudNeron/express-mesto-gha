const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const { ERR_CODE_NOT_FOUND } = require('./utils/errstatus');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { handleDefaultError } = require('./middlewares/handleDefaultError');
const { validateUrl } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2)
      .max(30),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().min(2)
      .max(30),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res) => {
  res.status(ERR_CODE_NOT_FOUND).send({ message: 'Некорректный путь' });
});

app.use(errors());
app.use(handleDefaultError);

app.listen(PORT, () => {
  console.log(`hello there, port: ${PORT}`);
});
