const { Router } = require('express');
const {
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  findProductById,
} = require('../controllers/product.controller');
const { verifyProductById } = require('../middlewares/products.middlewares');

const router = Router();

router.get('/', findProduct);

router.get('/:id', verifyProductById, findProductById);

router.post('/', createProduct);

router.patch('/:id', verifyProductById, updateProduct);

router.delete('/:id', verifyProductById, deleteProduct);

module.exports = {
  productRouter: router,
};
