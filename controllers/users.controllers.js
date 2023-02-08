const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');

const findUsers = catchAsync(async (req, res, next) => {
  // 1. BUSCAR TODOS LOS USUARIOS QUE ESTAN CON STATUS TRUE
  const users = await User.findAll({
    where: {
      status: true,
    },
  });

  // NOTA: NO ES NECESARIO ENVIAR MENSAJE DE ERROR SI NO HAY USUARIOS, DEBIDO A QUE EL DEVUELVE UN ARRAY VACIO
  // LES PONGO UN EJEMPLO, SUPONGAMOS QUE USTEDES BUSCAN ALGUN PRODUCTO EN UNA TIENDA, Y ESE PRODUCTO NO SE ENCUENTRA,
  // LA TIENDA NO LE ENVIA A USTED NINGUN MENSAJE DE ERROR, SIMPLEMENTE NO LE MUESTRA NADA, ES POR ESO QUE EN ESTE CASO
  // PARA BUSCAR TODOS LOS USUARIOS NO ES NECESARIO DEVOLVER UN ERROR SI NO LOS ENCUENTRA, SIMPLEMENTE RETORNARA UN ARREGLO VACIO

  // 2. ENVIAR UNA RESPUESTA AL USUARIO
  res.status(200).json({
    status: 'success',
    message: 'Users was found successfully',
    users,
  });
});

const findUser = catchAsync(async (req, res, next) => {
  // 1. OBTENER EL ID DE LOS PARAMETROS
  const { user } = req;

  // 4. ENVIAR UNA RESPUESTA AL USUARIO
  res.status(200).json({
    status: 'success',
    message: 'User was found successfully',
    user,
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  // 1. OBTENER EL ID DE LOS PARAMETROS
  const { user } = req;
  // 2. OBTENER LA INFORMACION A ACTUALIZAR DE LA REQ.BODY
  const { username, email } = req.body;

  // 5. REALIZAR LA ACTUALIZACIÓN DEL USUARIO, CAMPOS USERNAME, EMAIL
  await user.update({ username, email });

  // 6. ENVIAR UNA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'User updated successfully',
  });
});

const deleteUser = catchAsync(async (req, res, next) => {
  // 1. OBTENER user ID DE LOS PARAMETROS
  const { user } = req;
  // 4. REALIZAR LA ACTUALIZACIÓN DEL STATUS DEL USUARIO ENCONTRADO ANTERIORMENTE
  await user.update({ status: false });
  // 5. ENVIAR UNA RESPUESTA AL CLIENTE
  res.status(200).json({
    status: 'success',
    message: 'User deleted successfully',
  });
});

module.exports = {
  findUsers,
  findUser,
  updateUser,
  deleteUser,
};
