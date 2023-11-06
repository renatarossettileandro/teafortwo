const express = require('express');
const cors = require('cors'); 
const router = require('./router');
const { createProxyMiddleware } = require('http-proxy-middleware');


const app = express();

app.use('/api', createProxyMiddleware({ target: 'http://localhost:4000', changeOrigin: true }));

const PORT = process.env.PORT || 4000;

app.use(express.json());

// Permitindo rodar frontend e backend em portas diferentes
app.use(cors());

app.use(router);

app.listen(PORT, () => {
    console.log(`Server is listening in port ${PORT}`);
});
