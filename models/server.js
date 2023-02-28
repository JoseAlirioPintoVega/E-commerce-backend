const cors = require('cors');
const express = require('express');
const helmet = require('helmet');
const hpp = require('hpp');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');

const { db } = require('../database/db');
const { authRouter } = require('../routes/auth.routes');
const { categoriesRouter } = require('../routes/categories.routes');
const { productRouter } = require('../routes/product.routes');
const { usersRouter } = require('../routes/user.routes');
const { cartRouter } = require('../routes/cart.routes');
const AppError = require('../utils/appError');
const globalErrorHandler = require('../controllers/error.controler');
const initModel = require('./init.models');

//1 creamos una clase

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.limiter = rateLimit({
      max: 100,
      windowMs: 60 * 60 * 1000,
      message: 'Too many request from this IP, please Try again more Later',
    });
    this.paths = {
      user: '/api/v1/user',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
      auth: '/api/v1/auth',
      cart: '/api/v1/cart',
    };

    // es para llamar el metodo de conexion con la base de datos
    this.database();
    //
    this.middlewares();
    this.routes();
  }
  middlewares() {
    this.app.use(helmet());

    this.app.use(xss());
    this.app.use(hpp());

    if (process.env.NODE_ENV === 'development') {
      console.log('HOLA ESTOY EN DESARROLLO');
    }
    if (process.env.NODE_ENV === 'production') {
      console.log('HOLA ESTOY EN PRODUCCIÓN');
    }
    this.app.use('/api/v1', this.limiter);

    this.app.use(morgan('dev'));
    this.app.use(cors());
    this.app.use(express.json());
  }

  routes() {
    // utilizar las rutas de productos
    this.app.use(this.paths.products, productRouter);

    // utilizar las rutas de user
    this.app.use(this.paths.user, usersRouter);
    // utilizar las rutas de categories
    this.app.use(this.paths.categories, categoriesRouter);

    this.app.use(this.paths.auth, authRouter);

    this.app.use(this.paths.cart, cartRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't find ${req.originalUrl} on this server`, 404)
      );
    });
    this.app.use(globalErrorHandler);
  }
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

    //relations
    initModel();

    db.sync()
      .then(() => console.log('Database synced'))
      .catch(error => console.log(error));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Server us running on port`, this.port);
    });
  }
}
// 2 exportamos el SERVIDOR
// clase  tiene ATRIBUTOS Y METODOS ,  caracteristicas y  acciones

module.exports = Server;
