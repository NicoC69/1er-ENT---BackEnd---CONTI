const express = require('express');
const hbs = require('hbs');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const { loadProducts } = require('./routes/productRouter');


// Configuración de HBS (Handlebars para Express)
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Directorio de vistas
app.set('views', path.join(__dirname, 'views'));

// Configuración de Socket.io
app.set('socketio', io); // Hacer el servidor socket.io accesible a través del contexto de la aplicación


// Ruta para la vista home
app.get('/home', (req, res) => {
    const products = loadProducts();
    res.render('home', { products: products });
});

// Ruta para la vista en tiempo real
app.get('/realtimeproducts', (req, res) => {
    const products = loadProducts();
    res.render('realTimeProducts', { products: products });
});


app.use(express.json());

const productsRouter = require('./routes/productRouter');
app.use('/api/products', productsRouter);

const cartsRouter = require('./routes/cartsRouter');
app.use('/api/carts', cartsRouter);


server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});