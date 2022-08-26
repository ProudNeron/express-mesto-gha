const router = require('express').Router();

const {
  getAllCards, createCard, deleteCard, putLike, removeLike,
} = require('../controllers/cards');

router.get('/', getAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', putLike);
router.delete('/:cardId/likes', removeLike);

module.exports = router;
