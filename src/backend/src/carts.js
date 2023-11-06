const express = require('express');
const db = require('./db.js');
const cartsRouter = express.Router();


// adicionar um pedido novo
cartsRouter.post('/', async (req, res, next) => {
    try {
        const { produtos_id, quantidade, preco_total, registro_id, sessao_id } = req.body;

        // Verificar se o item já está no carrinho
        const checkQuery = 'SELECT * FROM basket_item WHERE produtos_id = $1 AND sessao_id = $2';
        const checkValues = [produtos_id, sessao_id];

        const checkResult = await db.query(checkQuery, checkValues);

        if (checkResult.rows.length > 0) {
            // Item já está no carrinho, incrementa a quantidade do já existente    
            const existingItem = checkResult.rows[0];
            const newQuantidade = existingItem.quantidade + quantidade;

            const updateQuery = 'UPDATE basket_item SET quantidade = $1 WHERE id = $2';
            const updateValues = [newQuantidade, existingItem.id];

            await db.query(updateQuery, updateValues);
            
            res.json({ message: 'Item quantity updated', basket_item_id: existingItem.id });
        } else {
            // Item não está no carrinho, pode ser adicionado
            const insertQuery = 'INSERT INTO basket_item (produtos_id, quantidade, preco_total, registro_id, sessao_id) VALUES ($1, $2, $3, $4, $5)';
            const insertValues = [produtos_id, quantidade, preco_total, registro_id, sessao_id];

            const insertResult = await db.query(insertQuery, insertValues);
            res.json({ message: 'New item registered', basket_item_id: insertResult.rows[0].id });
        }
    } catch (error) {
        console.log('Error executing query', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Atualizar um pedido
cartsRouter.put('/:id', async (req, res, next) => {
    try {
        const { quantidade } = req.body;

        // Calcula o novo preco_total
        const queryGetQuantidade = 'SELECT quantidade FROM basket_item WHERE id = $1';
        const quantidadeResult = await db.query(queryGetQuantidade, [req.params.id]);
        const quantidadeAtual = quantidadeResult.rows[0].quantidade;

        const queryGetPreco = 'SELECT preco FROM produtos WHERE id = (SELECT produtos_id FROM basket_item WHERE id = $1)';
        const precoResult = await db.query(queryGetPreco, [req.params.id]);
        const preco = precoResult.rows[0].preco;

        const novoPrecoTotal = quantidade * preco;

        // Atualiza a quantidade e preco_total no banco de dados
        const query = 'UPDATE basket_item SET quantidade = $1, preco_total = $2 WHERE id = $3';
        const values = [quantidade, novoPrecoTotal, req.params.id];

        const result = await db.query(query, values);
        console.log('Item updated');
        res.json('Item updated');

    } catch (error) {
        console.log('Error executing query', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

// Atualizar o total dos itens
cartsRouter.get('/total', async(req, res, next) => {
    try {
        const query = `
            SELECT SUM(preco_total) 
            FROM basket_item 
            INNER JOIN registro ON basket_item.registro_id = registro.id 
            WHERE basket_item.sessao_id = registro.sessao_id
        `;
        const result = await db.query(query);
        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({error: 'An error occurred'});
    }
});


//deletar um pedido
cartsRouter.put('/:id', async (req, res, next) => {
    try {
        const query = 'UPDATE basket_item SET status = $1 WHERE id = $2 AND status = $3';
        const values = ['canceled', req.params.id, 'Pending'];

        const result = await db.query(query, values);
        res.json('Order canceled');
    } catch (error) {
        console.error('Error executing query', error);
        res.status(500).json({ error: 'An error occurred' });
    }
});

//deletar um pedido do basket
cartsRouter.delete('/:id', async (req, res, next) =>{
    try{
        const query = 'DELETE from basket_item WHERE id = $1';
        const values = [req.params.id];

        const result = await db.query(query, values);
        res.json('Item deleted');
    } catch (error) {
        console.error('Error executing query', error);
        res. status(500).json({error: 'An error occurred'});
    }
});


//mostrar lista de pedidos
cartsRouter.get('/', (req, res, next) => {
    db.query('SELECT basket_item.id as basket_item_id, produtos.id as produtos_id, produtos.nome, produtos.preco, produtos.img, produtos.texto, produtos.categoriaid, basket_item.quantidade, basket_item.preco_total, basket_item.registro_id, basket_item.sessao_id FROM basket_item INNER JOIN produtos ON basket_item.produtos_id = produtos.id INNER JOIN registro ON basket_item.registro_id = registro.id WHERE basket_item.sessao_id = registro.sessao_id ORDER BY basket_item.id')
    .then(result => {
        res.json(result.rows);
    })
    .catch(err => {
        console.error('Error executing query', err);
        res.status(500).json({error: 'An error occurred'});
    });
});




//mostrar lista de pedidos por id
cartsRouter.get('/:id', (req,res,next)=>{
    const query = 'SELECT * FROM new_orders WHERE id = $1';
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

});

//validar cart para checkout
cartsRouter.get('/:id/checkout', (req, res, next) => {
    const query = 'SELECT * FROM new_orders WHERE id = $1';
    const values = [req.params.id];
    //verificando se o cart tem pedidos para fazer checkout
    db.query(query, values)
        .then(result => {
            if(result.rows.length){
                //logica para todos os pagamentos são aprovados
                res.json({ message: 'Checkout successful', order: result.rows[0] });
            } else {
                res.status(404).json({error: 'Your cart is empty'});
            }
        })
        .catch(err =>{
            console.error('Error executing query', err);
            res.status(500).json({error: 'An error occured'});
        });

});



module.exports = cartsRouter;