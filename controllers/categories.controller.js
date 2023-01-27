const Categories = require('../models/categories.model');

exports.findCategories = async (req, res) => {
  try {
    //
    const categories = await Categories.findAll({
      where: { status: true },
    });
    //enviamos la respuesta al usuario
    res.status(200).json({
      status: 'success',
      message: 'The categories were found',
      categories,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

exports.findCategory = async (req, res) => {
  try {
    const { id } = req.params;
    //
    const category = await Categories.findOne({
      where: {
        id,
        status: true,
      },
    });
    if (!categories) {
      return res.status(404).json({
        status: 'error',
        message: 'categories not found',
      });
    }
    //enviamos la respuesta al usuario
    res.status(200).json({
      status: 'success',
      message: 'The categories were found',
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

exports.createCategory = async (req, res) => {
  try {
    // obtenemos la informacion del req.body
    const { name } = req.body;
    // creamos la categoria con la informacion obtenida

    const category = await Categories.create({
      name: name.toLowerCase(),
    });

    //enviamos la respuesta al usuario
    res.status(200).json({
      status: 'success',
      message: 'The category was created',
      category,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    //
    const { id } = req.params;
    //
    const { name } = req.body;

    const category = await Categories.findOne({
      where: {
        id,
        status: true,
      },
    });
    if (!category) {
      return res.status(404).json({
        status: 'error',
        message: 'categories not found',
      });
    }
    const updatedCategory = await category.update({ name: toLowerCase() });
    //enviamos la respuesta al usuario
    res.status(200).json({
      status: 'success',
      message: 'The category was Update',
      updatedCategory,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    //
    const categories = await Categories.findOne({
      where: {
        id,
        status: true,
      },
    });
    if (!categories) {
      return res.status(404).json({
        status: 'error',
        message: 'categories not found',
      });
    }
    await category.update({ status: false });

    //enviamos la respuesta al usuario
    res.status(200).json({
      status: 'success',
      message: 'The category was delete',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
    });
  }
};
