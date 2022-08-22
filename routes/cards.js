const router = require('express').Router();

const {
  getAllCards, createCard, deleteCard, putLike, removeLike,
} = require('../controllers/cards');

router.get('/cards', getAllCards);
router.post('/cards', createCard);
router.delete('cards/:cardId', deleteCard);
router.put('cards/:cardId/likes', putLike);
router.delete('cards/:cardId/likes', removeLike);

module.exports = router;
