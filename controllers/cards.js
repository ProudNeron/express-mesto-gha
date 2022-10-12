const Card = require('../models/card');
const AuthorizedButForbiddenError = require('../errors/authorized-but-forbidden-error');
const NotFoundError = require('../errors/not-found-error');
const ValidationOrCastError = require('../errors/validation-or-cast-error');

module.exports.getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationOrCastError('Переданы некорректные данные при создании карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findOneAndDelete({ _id: req.params.cardId, owner: req.user._id })
    .orFail(() => {
      throw new NotFoundError(`Карточка с указанным _id:${req.params.cardId} не найдена`);
    })
    .then(() => res.send({ message: 'Пост удалён' }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationOrCastError('Некорректный _id карточки'));
      }
      if (err.name === 'Authorized But Forbidden') {
        return next(new AuthorizedButForbiddenError('Попытка удалить чужую карточку'));
      }
      return next(err);
    });
};

module.exports.putLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(`Передан _id:${req.params.cardId} карточки не найден`);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationOrCastError('Некорректный _id карточки'));
      }
      return next(err);
    });
};

module.exports.removeLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError(`Передан  _id:${req.params.cardId} карточки не найден`);
    })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationOrCastError('Некорректный _id карточки'));
      }
      return next(err);
    });
};
