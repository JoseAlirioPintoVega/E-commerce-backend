const Product = require("../models/product.model");


exports.findProduct = async(req, res) =>{

    const products = await Product.findAll({
        where: {
            status: true
        }
    });

    res.status(200).json({
        status: 'success',  
        message:'The products found were successfully ',
        products,
    });
}
exports.findProductById = async(req, res) =>{
    
    const { id } = req.params;

    const product = await Product.findOne({
        where: {
            id,
            status: true
        }
    });

    if(!product){
           return  res.status(404).json({
            status: 'error',
            message: 'The product was not found'
        })
    }

    res.status(200).json({
        status: 'success',  
        message:'The product found was successfully ',
        product,
    });
}

exports.createProduct = async (req, res) =>{
    const { title, description, quantity, price, categoryId, userId} = req.body
    
    const newProduct = await Product.create({ 
        title: title.toLowerCase(),
        description: description.toLowerCase(),
        quantity,
        price,
        categoryId,
        userId
    })

    res.status(201).json({
        status: 'success',
        message:'ROUTE - POST',
        newProduct,
    });
}


exports.updateProduct = async(req, res) =>{
    // 1.OBTENGO MI ID DEL PRODUCTO DE LA REQ.PARAMS
    const { id } = req.params;
    // 2 OBTENGO MI ID DE LA REQ.BODY
    const { title, description, quantity, price} = req.body;
    // 3. BUSCAR EL PRODUCTO A ACTUALIZAR
    const product = await Product.findOne({
        where: {
            id,
            status: true
        }
    });
    //4. SI NO EXISTE EL PRODUCTO ENVIAMOS UN ERROR
    if(!product){
        return res.status(404).json({
            status: 'error',
            message: 'The product was not found'    
        })
    }
    // 5. SI TODO SALIO BIEN, ACTUALIZAMOS EL PRODUCTO ENCONTRADO
    const updatedProduct = await product.update({
            title: title.toLowerCase(),
            description: description.toLowerCase(),
            quantity,
            price
        })
        //6. ENVIO LA RESPUESTA AL CLIENTE
    res.status(200).json({
        status: 'success',
        message:'The product haw been updated successfully',
        updatedProduct
    });
}



exports.deleteProduct = async(req, res) =>{
    //1. OBTENGO LOS DATOS DE MI ID DEL REQ.PARAMS
    const { id } = req.params;
    //2. BUSCAR EL PRODUCTO A ELIMINAR "ACTUALIZAR EL STATUS"
    const product = await Product.findOne({
        where: {
          id,
          status: true,
        },
      });
    // 3.  si el producto no existe enviamos un error 
    if (!product) {
      return res.status(404).json({
        status: 'error',
        message: 'The product was not found',
      });
    } 

    //4. si esta todo correcto realizamos la actualizacion

    await product.update({ status: false });

    // 5. enviamos la respuesta al cliente 
    res.status(200).json({
        status: 'success',
        message:'The product was deleted sucessfully',
    });
}