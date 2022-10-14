const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors, celebrate, Joi } = require('celebrate');
const NotFoundError = require('./errors/not-found-error');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { handleDefaultError } = require('./middlewares/handleDefaultError');
const { validateUrl } = require('./utils/utils');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
  }).unknown(true),
}), createUser);

app.use(auth);

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (next) => {
  next(new NotFoundError('Некорректный путь'));
});

app.use(errors());
app.use(handleDefaultError);

app.listen(PORT, () => {
  console.log(`hello there, port: ${PORT}`);
});
