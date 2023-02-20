const Category = require('../models/category.model');
const Product = require('../models/product.model');
const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

exports.findCategories = catchAsync(async (req, res, next) => {
  const categories = await Category.findAll({
    attributes: ['id', 'name'],
    where: { status: true },
    include: [
      {
        model: Product,
        attributes: { exclude: ['createdAt', 'updatedAt', 'status'] },
        where: {
          status: true,
        },
        include: [
          {
            model: User,
            attributes: {
              exclude: [
                'createdAt',
                'updatedAt',
                'status',
                'password',
                'role',
                'passwordChangedAt',
              ],
            },
          },
        ],
      },
    ],
  });
  //enviamos la respuesta al usuario
  res.status(200).json({
    status: 'success',
    message: 'The categories were found',
    categories,
  });
});

exports.findCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  //enviamos la respuesta al usuario
  res.status(200).json({
    status: 'success',
    message: 'The categories were found',
    category,
  });
});

exports.createCategory = catchAsync(async (req, res, next) => {
  const { name } = req.body;

  const category = await Category.create({
    name: name.toLowerCase(),
  });

  res.status(200).json({
    status: 'success',
    message: 'The category was created',
    category,
  });
});

exports.updateCategory = catchAsync(async (req, res, next) => {
  //
  const { name } = req.body;
  const { category } = req;

  const updatedCategory = await category.update({ name: name.toLowerCase() });
  //enviamos la respuesta al usuario
  res.status(200).json({
    status: 'success',
    message: 'The category was Update',
    updatedCategory,
  });
});

exports.deleteCategory = catchAsync(async (req, res, next) => {
  const { category } = req;
  await category.update({ status: false });

  //enviamos la respuesta al usuario
  res.status(200).json({
    status: 'success',
    message: 'The category was delete',
  });
});
