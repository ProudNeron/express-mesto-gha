const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const { ERR_CODE_NOT_FOUND } = require('./utils/errstatus');
const { auth } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const { handleDefaultError } = require('./middlewares/handleDefaultError');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.post('/signin', login);
app.post('/signup', createUser);

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
