const { Client } = require('pg');

const db = new Client({
    connectionString: 'postgres://postgres:postgres@localhost:5432/teashop',
});
//postgres://usuario:senha@endereco_do_servidor:porta/nome_do_banco


// Conectando ao banco de dados
db.connect()
    .then(() =>{
        console.log('Conectado ao banco de dados');
    })
    .catch(err =>{
        console.log('Erro ao conectar ao banco de dados', err);
    });

module.exports = db;
