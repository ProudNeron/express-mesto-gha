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
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new ValidationOrCastError('некорректные данные для создания карточки'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError(`Карточка с указанным _id:${req.params.cardId} не найдена`);
    })
    .then((card) => {
      console.log(card.owner.toString());
      console.log(req.user._id);
      if (card.owner.toString() !== req.user._id) {
        throw new AuthorizedButForbiddenError('Попытка удалить чужую карточку');
      }
      Card.findByIdAndRemove(req.params.cardId)
        .then(() => res.send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new ValidationOrCastError('Некорректный _id карточки'));
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
