const { Router } = require('express');
const { createUser } = require('../controllers/auth.controller');
const { check } = require('express-validator');
const { validIfExistUserEmail } = require('../middlewares/user.middlewares');
const { validateFields } = require('../middlewares/validateField.middleware');

const router = Router();

router.post(
  '/signup',
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

module.exports = {
  authRouter: router,
};
