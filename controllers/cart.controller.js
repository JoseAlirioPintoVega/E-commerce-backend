const Cart = require('../models/cart.model');
const Order = require('../models/order.models');
const Product = require('../models/product.model');
const ProductInCart = require('../models/productInCart.model');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.addProductToCart = catchAsync(async (req, res, next) => {
  const { productId, quantity } = req.body;
  const { cart } = req;

  const productInCart = await ProductInCart.create({
    cartId: cart.id,
    productId,
    quantity,
  });
  res.status(201).json({
    status: 'success',
    message: 'The product has beed added',
    productInCart,
  });
});
exports.updateCart = catchAsync(async (req, res, next) => {
  const { newQty } = req.body;
  const { productInCart } = req;

  if (newQty < 0) {
    return next(new AppError('The quantity must be greater than 0', 400));
  }

  if (newQty === 0) {
    await productInCart.update({ quantity: newQty, status: 'removed' });
  } else {
    await productInCart.update({ quantity: newQty, status: 'active' });
  }

  res.status(200).json({
    status: 'success',
    message: 'The product in cart has been updated',
  });
});
exports.removeProductToCart = catchAsync(async (req, res, next) => {
  const { productInCart } = req;
  await productInCart.update({ quantity: 0, status: 'removed' });

  res.status(200).json({
    status: 'success',
    message: 'The product in cart has been removed',
    productInCart,
  });
});

exports.buyProductOnCart = catchAsync(async (req, res, next) => {
  // buscar el carrito del usuario
  const { sessionUser } = req;

  const cart = await Cart.findOne({
    attributes: ['id', 'userid'],
    where: {
      userId: sessionUser.id,
      status: 'active',
    },
    include: [
      {
        model: ProductInCart,
        attributes: { exclude: ['createdAt', 'updateAt'] },
        where: {
          status: 'active',
        },
        include: [
          {
            model: Product,
            attributes: { exclude: ['status', 'createdAt', 'updateAt'] },
          },
        ],
      },
    ],
  });

  if (!cart) {
    return next(new AppError('There are not producs in cart', 400));
  }

  let totalPrice = 0;
  cart.productInCarts.forEach(productInCart => {
    totalPrice = productInCart.quantity * productInCart.product.price;
  });

  // console.log(cart.productInCarts[0].product.price);
  // console.log(cart.productInCarts[0].quantity);

  // ahora vamos a actualizar el stock de los productos
  const purchasedProductPromises = cart.productInCarts.map(
    async productInCart => {
      // 1. buscar el producto para actualizar su información
      const product = await Product.findOne({
        where: {
          id: productInCart.productId,
        },
      });

      //2. calcular la cantidad de productos que quedan en la tiendas
      const newStock = product.quantity - productInCart.quantity;

      //3. actualizamos la informacion y la retornamos

      return await product.update({
        quantity: newStock,
      });
    }
  );

  // con el Promise.all se resulve un arreglo de promesas
  await Promise.all(purchasedProductPromises);

  const chanceStatePurchasedProductPromises = cart.productInCarts.map(
    async productInCart => {
      const productInCartFound = await ProductInCart.findAll({
        where: {
          id: productInCart.id,
          status: 'active',
        },
      });
      return await productInCartFound.update({ status: 'purchased' });
    }
  );
  await Promise.all(chanceStatePurchasedProductPromises);

  await cart.update({ status: 'purchased' });

  const order = await Order.create({
    userId: sessionUser.id,
    cartId: cart.id,
    totalPrice,
  });

  res.status(201).json({
    status: 'success',
    message: 'The order has been grenerated',
    cart,
    order,
  });
});
