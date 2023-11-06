const express = require('express');
const db = require('./db.js');
const productsRouter = express.Router();


//params para id
productsRouter.param('id', (req, res, next)=>{
    const products_id = req.params.id;
    next();
});

// display do tipo de produto
productsRouter.get('/:category/:id', (req, res, next) => {
    const category = req.params.category;
    const productId = req.params.id;

    const query = `
    SELECT produtos.*
    FROM produtos
    INNER JOIN categoria ON produtos.categoriaid = categoria.id
    WHERE categoria.nome = $1 AND produtos.id = $2
    `;

    const values = [category, productId];

    db.query(query, values)
        .then(result => {
            const foundProduct = result.rows[0];

            if (foundProduct) {
                res.json(foundProduct);
            } else {
                res.status(404).json({ error: 'Product not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});


// display do tipo de produto
productsRouter.get('/:name', (req, res, next) => {
    const query = `
    SELECT produtos.*
    FROM produtos
    INNER JOIN categoria ON produtos.categoriaid = categoria.id
    WHERE categoria.nome = $1
     `
    const values = [req.params.name];

    db.query(query, values)
        .then(result => {
            const foundProducts = result.rows; 

            if (foundProducts.length > 0) { 
                res.json(foundProducts); 
            } else {
                res.status(404).json({ error: 'Products not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});

//display tipo de produto pela pesquisa
productsRouter.post('/search', (req, res, next) => {
    const query = `
        SELECT produtos.*
        FROM produtos
        WHERE produtos.nome ILIKE $1
    `;

    const searchTerm = req.body.term;

    const values = [`%${searchTerm}%`];

    db.query(query, values)
        .then(result => {
            const foundProducts = result.rows;

            if (foundProducts.length > 0) {
                res.json(foundProducts);
            } else {
                res.status(404).json({ error: 'Products not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});






//display todos os produtos
productsRouter.get('/', (req, res, next)=>{

    db.query('SELECT * FROM produtos')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error('Error executing query', err);
        res.status(500).json({error: 'An error occurred'});
    });

});

// display produto por id
/*productsRouter.get('/:id', (req, res, next) =>{
    const query = 'SELECT * FROM produtos WHERE id = $1';
    const values = [req.params.id];
    console.log(values);

    db.query(query, values)
        .then(result => {
            if (result.rows.length > 0) {
                res.json(result.rows[0]);
            } else {
                res.status(404).json({ error: 'User not found' });
            }
        })
        .catch(err => {
            console.error('Error executing query', err);
            res.status(500).json({ error: 'An error occurred' });
        });
});*/







module.exports = productsRouter;