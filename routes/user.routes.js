const { Router } = require('express');

const {
  updateUser,
  deleteUser,
  findUsers,
  findUser,
} = require('../controllers/users.controllers');
const { validIfExistUser } = require('../middlewares/user.middlewares');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validIfExistUser, findUser);

router.patch('/:id', validIfExistUser, updateUser);

router.delete('/:id', validIfExistUser, deleteUser);

module.exports = {
  usersRouter: router,
};
