const express = require('express');
const fs = require('fs');
const PORT = 8080;
const app = express();

app.use(express.json());

const productsRouter = require('./routes/productRouter');
app.use('/api/products', productsRouter);

const cartsRouter = require('./routes/cartsRouter');
app.use('/api/carts', cartsRouter);


app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
