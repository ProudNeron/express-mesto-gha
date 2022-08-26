const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      _id: card.id,
    }))
    .catch((err) => {
      const ERROR_CODE = 400;
      if (err.name === 'ValidationError') {
        res.status(ERROR_CODE).send({ message: 'Переданы некорректные данные при создании карточки' });
        return;
      }
      res.status(500).send({ message: err.message });
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
      const ERR_CODE = 404;
      if (err.name === 'CardNotFound') {
        res.status(ERR_CODE).send({ message: err.message });
        return;
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.putLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const CardNotFound = new Error(`Передан несуществующий _id:${req.params.cardId} карточки`);
      CardNotFound.name = 'CardNotFound';
      return CardNotFound;
    })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      createdAt: card.createdAt,
      _id: card.id,
    }))
    .catch((err) => {
      const ERR_CODE = 404;
      const ERR_CODE_VALIDATION = 400;
      if (err.name === 'CardNotFound') {
        res.status(ERR_CODE).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные для постановки лайка' });
      }
      res.status(500).send({ message: err.message });
    });
};

module.exports.removeLike = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      const CardNotFound = new Error(`Передан несуществующий _id:${req.params.cardId} карточки`);
      CardNotFound.name = 'CardNotFound';
      return CardNotFound;
    })
    .then((card) => res.send({
      name: card.name,
      link: card.link,
      owner: card.owner,
      likes: card.likes,
      createdAt: card.createdAt,
      _id: card.id,
    }))
    .catch((err) => {
      const ERR_CODE = 404;
      const ERR_CODE_VALIDATION = 400;
      if (err.name === 'CardNotFound') {
        res.status(ERR_CODE).send({ message: err.message });
        return;
      }
      if (err.name === 'ValidationError') {
        res.status(ERR_CODE_VALIDATION).send({ message: 'Переданы некорректные данные для снятия лайка' });
      }
      res.status(500).send({ message: err.message });
    });
};
