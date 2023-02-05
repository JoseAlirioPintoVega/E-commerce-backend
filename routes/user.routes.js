const { Router } = require('express');
const { check } = require('express-validator');
const {
  createUser,
  updateUser,
  deleteUser,
  findUsers,
  findUser,
} = require('../controllers/users.controllers');
const {
  validIfExistUser,
  validIfExistUserEmail,
} = require('../middlewares/user.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validIfExistUser, findUser);

router.post(
  '/',
  [
    check('username', 'The username must be mandatory').not().isEmpty(),
    check('email', 'The email must be mandatory').not().isEmpty(),
    check('email', 'The email has been a correct format').isEmail(),
    check('password', 'The password must be mandatory').not().isEmpty(),
    check(
      'password',
      'The password need min 8 caracters and max 10 caracters'
    ).isLength({
      min: 8,
      max: 10,
    }),
  ],
  validateFields,
  validIfExistUserEmail,
  createUser
);

router.patch('/:id', validIfExistUser, updateUser);

router.delete('/:id', validIfExistUser, deleteUser);

module.exports = {
  usersRouter: router,
};
