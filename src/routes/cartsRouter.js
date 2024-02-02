const express = require('express');
const fs = require('fs');
const router = express.Router();
const path = require('path');

const { loadProducts } = require('./productRouter');
const { saveProducts } = require('./productRouter');


function generateUniqueId() {
    return Date.now(); 
}

const cartsDBPath = path.join(__dirname, '../carritos.json');

const loadCarts = () => {
    try {
        const data = fs.readFileSync(cartsDBPath, 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
};

const cartsDB = loadCarts();

const saveCarts = (carts) => {
    fs.writeFileSync(cartsDBPath, JSON.stringify(carts, null, 2), 'utf8');
    console.log('Carritos guardados en el archivo JSON:', carts);
};


// crear un nuevo carrito
router.post('/', (req, res) => {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
        return res.status(400).json({ error: 'Se deben proporcionar productos para crear un carrito.' });
    }

    const currentProducts = loadProducts();

    const newCart = {
        id: generateUniqueId(),
        products: products,
    };

    for (const productInCart of newCart.products) {
        const existingProduct = currentProducts.find(p => p.id === productInCart.id);

        if (!existingProduct || existingProduct.stock < productInCart.quantity) {
            return res.status(400).json({ error: 'Producto no encontrado o stock insuficiente.' });
        }

        existingProduct.stock -= productInCart.quantity;
    }

    saveProducts(currentProducts);

    cartsDB.push(newCart);

    saveCarts(cartsDB);

    const io = req.app.get('socketio');
        io.emit('carirtoCreado', nuevoProducto);

    res.status(201).json({ message: 'Carrito creado correctamente', cart: newCart });
});





// listar productos de un carrito por ID de carrito
router.get('/:cid', (req, res) => {
    const cartId = req.params.cid;

    const cart = cartsDB.find(cart => cart.id == cartId);

    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
    }

    const productsDB = loadProducts();
    const cartProducts = [];

    for (const cartProduct of cart.products) {
        const product = productsDB.find(p => p.id == cartProduct.id);
        if (product) {
            cartProducts.push({
                id: product.id,
                title: product.title,
                quantity: cartProduct.quantity,
            });
        }
    }

    res.json({ message: 'Productos en el carrito', products: cartProducts });
});

// agregar un producto al carrito por ID de carrito y ID de producto
router.post('/:cid/product/:pid', (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity || 1;

    const io = req.app.get('socketio');

    const cartsDB = loadCarts

const cart = cartsDB.find(cart => cart.id == cartId);
    if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado.' });
}

const existingProduct = cart.products.find(product => product.id == productId);
    if (existingProduct) {
    existingProduct.quantity += quantity;
    } else {
        cart.products.push({ id: productId, quantity });
    }

    saveCarts(cartsDB);

res.json({ message: 'Producto agregado al carrito correctamente', cart: cart });
});

module.exports = router;
