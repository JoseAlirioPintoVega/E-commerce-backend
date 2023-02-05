const Categories = require('../models/categories.model');
const catchAsync = require('../utils/catchAsync');

exports.findCategories = catchAsync(async (req, res, next) => {
  const categories = await Categories.findAll({
    where: { status: true },
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

  const category = await Categories.create({
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
