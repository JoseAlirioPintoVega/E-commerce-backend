const express = require('express');
const { productRouter } = require('../routes/product.routes');
const cors = require('cors');
const { db } = require('../dataBase/db');
const morgan = require('morgan');
const { usersRouter } = require('../routes/user.routes');
const { categoriesRouter } = require('../routes/categories.routes');

//1 creamos una clase

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.paths = {
      user: '/api/v1/user',
      products: '/api/v1/products',
      categories: '/api/v1/categories',
    };

    // es para llamar el metodo de conexion con la base de datos
    this.database();

    //
    this.middlewares();
    this.routes();
  }
  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      console.log('HOLA ESTOY EN DESARROLLO');
    }
    if (process.env.NODE_ENV === 'production') {
      console.log('HOLA ESTOY EN PRODUCCIÓN');
    }

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
  }
  database() {
    db.authenticate()
      .then(() => console.log('Database authenticated'))
      .catch(error => console.log(error));

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
