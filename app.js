const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req, res, next) => {
  req.user = {
    _id: '630055ac4480a47204ca715c',
  };

  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('/', (req, res) => {
  const ERR_CODE = 400;
  if (req.baseUrl !== '/users' && req.baseUrl !== '/cards') {
    const incorrectRouteError = new Error('Некорректный путь');
    incorrectRouteError.name = 'IncorrectRoute';
    res.status(ERR_CODE).send({ message: incorrectRouteError.message });
  }
});

app.listen(PORT, () => {
  console.log(`hello there, port: ${PORT}`);
});
