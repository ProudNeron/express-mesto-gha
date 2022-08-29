const Card = require('../models/card');
const { ERR_CODE_NOT_FOUND, ERR_CODE_CAST, ERR_CODE_DEFAULT } = require('../utils/errstatus');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(ERR_CODE_DEFAULT).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      const CardNotFound = new Error(`Карточка с указанным _id:${req.params.cardId} не найдена`);
      CardNotFound.name = 'CardNotFound';
      return CardNotFound;
    })
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_CAST).send({ message: 'Некорректный _id карточки' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const CardNotFound = new Error(`Передан несуществующий _id:${req.params.cardId} карточки`);
      CardNotFound.name = 'CardNotFound';
      return CardNotFound;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_CAST).send({ message: 'Некорректный _id карточки' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      const CardNotFound = new Error(`Передан несуществующий _id:${req.params.cardId} карточки`);
      CardNotFound.name = 'CardNotFound';
      return CardNotFound;
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CardNotFound') {
        res.status(ERR_CODE_NOT_FOUND).send({ message: err.message });
        return;
      }
      if (err.name === 'CastError') {
        res.status(ERR_CODE_CAST).send({ message: 'Некорректный _id карточки' });
        return;
      }
      res.status(ERR_CODE_DEFAULT).send({ message: err.message });
    });
};
