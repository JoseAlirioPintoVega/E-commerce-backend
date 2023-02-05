const Category = require('../models/category.model');
const catchAsync = require('../utils/catchAsync');

exports.validCategoryById = catchAsync(async (req, res, next) => {
  const { id } = req.params;

  const category = await Category.findOne({
    where: {
      id,
      status: true,
    },
  });

  if (!category) {
    return res.status(404).json({
      status: 'error',
      message: 'Category not found',
    });
  }

  //4.
  req.category = category;
  next();
});
