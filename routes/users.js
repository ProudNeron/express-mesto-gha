const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getAllUsers, getUserInfo, getUserById, updateProfile, updateAvatar,
} = require('../controllers/users');

router.get('/', getAllUsers);
router.get('/me', getUserInfo);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum(),
  }),
}), getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
}), updateProfile);
router.patch('/me/avatar', updateAvatar);

module.exports = router;
