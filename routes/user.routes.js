const { Router } = require('express');
const { check } = require('express-validator');

const {
  updateUser,
  deleteUser,
  findUsers,
  findUser,
  updatePassword,
  getOrders,
  getOrderById,
} = require('../controllers/users.controllers');
const {
  protect,
  protectAccountOwner,
} = require('../middlewares/aut.middleware');
const { validIfExistUser } = require('../middlewares/user.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/orders', protect, getOrders);

router.get('/:id', validIfExistUser, findUser);

router.use(protect);
router.get('/orders/:id', getOrderById);

router.patch('/:id', validIfExistUser, updateUser);

router.patch(
  '/password/:id',
  [
    check('currentPassword', 'The current password must be mandatory')
      .not()
      .isEmpty(),
    check('newPassword', 'The new password must be mandatory').not().isEmpty(),
    validateFields,
  ],
  validIfExistUser,
  protectAccountOwner,
  updatePassword
);

router.delete('/:id', validIfExistUser, deleteUser);

module.exports = {
  usersRouter: router,
};
