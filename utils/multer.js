const multer = require('multer');

// multer.diskStorage();

// diskStorage almacena las imagenes en mi servidor

const storage = multer.memoryStorage();

// memoryStorage almacenamiento en nube , la guarda primero en la cache y luego a la nube

const upload = multer({ storage });

module.exports = { upload };
