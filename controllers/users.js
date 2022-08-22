const Users = require('../models/user');

module.exports.getAllUsers = (req, res) => {
  Users.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => res.status(500).send({ message: err.message }));
  res.send(req.body);
};

module.exports.getUserById = (req, res) => {
  Users.findById(req.params._id)
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  Users.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  Users.findByIdAndUpdate({ _id: req.params.user._id }, { name, about })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  Users.findByIdAndUpdate({ _id: req.params._id }, { avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => res.status(500).send({ message: err.message }));
};
