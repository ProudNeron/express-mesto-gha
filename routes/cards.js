const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllCards, createCard, deleteCard, putLike, removeLike,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required(),
    }).unknown(true),
  }),
  createCard,
);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
