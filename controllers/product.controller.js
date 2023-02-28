const Product = require('../models/product.model');
const catchAsync = require('../utils/catchAsync');
const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');
const { storage } = require('../utils/firebase');
const ProductImg = require('../models/productImg.model');

exports.findProduct = catchAsync(async (req, res, next) => {
  const products = await Product.findAll({
    where: {
      status: true,
    },
    include: [{ model: ProductImg }],
  });

  const productPromise = products.map(async product => {
    const productImgsPromises = product.productImgs.map(async productImg => {
      const imgRef = ref(storage, productImg.imgUrl);
      const url = await getDownloadURL(imgRef);

      productImg.imgUrl = url;
      return productImg;
    });
    await Promise.all(productImgsPromises);
  });
  await Promise.all(productPromise);

  res.status(200).json({
    status: 'success',
    message: 'The products found were successfully ',
    products,
  });
});

exports.findProductById = catchAsync(async (req, res, next) => {
  const { product } = req;
  const productImgPromises = product.productImgs.map(async productImg => {
    const imgRef = ref(storage, productImg.imgUrl);
    const url = await getDownloadURL(imgRef);

    productImg.imgUrl = url;
    return productImg;
  });

  const productImgs = await Promise.all(productImgPromises);

  res.status(200).json({
    status: 'success',
    message: 'The product found was successfully ',
    product,
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const { title, description, quantity, price, categoryId, userId } = req.body;

  console.log(req.files);

  const newProduct = await Product.create({
    title: title.toLowerCase(),
    description: description.toLowerCase(),
    quantity,
    price,
    categoryId,
    userId,
  });

  const productImgsPromises = req.files.map(async file => {
    const imgRef = ref(storage, `products/${Date.now()}-${file.originalname}`);
    const imgUploaded = await uploadBytes(imgRef, file.buffer);

    return await ProductImg.create({
      imgUrl: imgUploaded.metadata.fullPath,
      productId: newProduct.id,
    });
  });
  await Promise.all(productImgsPromises);

  res.status(201).json({
    status: 'success',
    message: 'The product was created successfully',
    newProduct,
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
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
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  //1. obtenemos product del req que fue hecho en el middleware
  const { product } = req;

  //4. si esta todo correcto realizamos la actualizacion

  await product.update({ status: false });

  // 5. enviamos la respuesta al cliente
  res.status(200).json({
    status: 'success',
    message: 'The product was deleted sucessfully',
  });
});
