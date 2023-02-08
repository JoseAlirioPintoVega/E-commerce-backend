const User = require('../models/user.model');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const generateJWT = require('../utils/jwt');

exports.createUser = catchAsync(async (req, res, next) => {
  //1. OBTENER LA INFORMACION DE LA REQ.BODY
  const { username, email, password, role = 'user' } = req.body;
  //2. CREAR EL USUARIO CON LA INFORMACION DE LA REQ.BODY
  // creamos una instancia de la clase User
  const user = new User({ username, email, password, role });

  // creamos una instacia de la clase user

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(password, salt);
  // guardar en la base de datos con las  contraseñas encritadas
  await user.save();
  const token = await generateJWT(user.id);
  //3. ENVIAR UNA RESPUESTA AL USUARIO
  res.status(201).json({
    status: 'success',
    message: 'User created successfully',
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
  });
});
