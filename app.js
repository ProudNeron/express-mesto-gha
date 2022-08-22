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
app.use(require('./routes/users'));
app.use(require('./routes/cards'));

app.listen(PORT, () => {
  console.log(`hello there, port: ${PORT}`);
});
