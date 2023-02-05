const Product = require('../models/product.model');

exports.findProduct = async (req, res) => {
  const products = await Product.findAll({
    where: {
      status: true,
    },
  });

  res.status(200).json({
    status: 'success',
    message: 'The products found were successfully ',
    products,
  });
};

exports.findProductById = async (req, res) => {
  const { product } = req;

  res.status(200).json({
    status: 'success',
    message: 'The product found was successfully ',
    product,
  });
};

exports.createProduct = async (req, res) => {
  const { title, description, quantity, price, categoryId, userId } = req.body;

  const newProduct = await Product.create({
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    quantity,
    price,
    categoryId,
    userId,
  });

  res.status(201).json({
    status: 'success',
    message: 'ROUTE - POST',
    newProduct,
  });
};

exports.updateProduct = async (req, res) => {
  // 1.OBTENGO MI ID DEL PRODUCTO DE LA REQ.PARAMS
  const { product } = req;
  // 2 OBTENGO MI ID DE LA REQ.BODY
  const { title, description, quantity, price } = req.body;

  // 5. SI TODO SALIO BIEN, ACTUALIZAMOS EL PRODUCTO ENCONTRADO
  const updatedProduct = await product.update({
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    quantity,
    price,
  });
  //6. ENVIO LA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'The product haw been updated successfully',
    updatedProduct,
  });
};

exports.deleteProduct = async (req, res) => {
  //1. obtenemos product del req que fue hecho en el middleware
  const { product } = req;

  //4. si esta todo correcto realizamos la actualizacion

  await product.update({ status: false });

  // 5. enviamos la respuesta al cliente
  res.status(200).json({
    status: 'success',
    message: 'The product was deleted sucessfully',
  });
};
