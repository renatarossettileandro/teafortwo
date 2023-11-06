const express = require('express');
const usersRouter = require('./users');
const productsRouter = require('./products');
const cartsRouter = require('./carts');

const router = express.Router({mergeParams: true});


//routers
router.use('/users', usersRouter);
router.use('/products', productsRouter);
router.use('/carts', cartsRouter);

//exports
module.exports = router;