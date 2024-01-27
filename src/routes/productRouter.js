const express = require('express');
const router = express.Router();
const fs = require('fs');


// generar un ID único
function generateUniqueId() {
    return Date.now(); 
}

const productsDBPath = './productos.json';

const loadProducts = () => {
    try {
        const data = fs.readFileSync(productsDBPath, 'utf8');
        return JSON.parse(data) || [];
    } catch (error) {
        return [];
    }
    };

const saveProducts = (products) => {
    fs.writeFileSync(productsDBPath, JSON.stringify(products, null, 2), 'utf8');
    console.log('Productos guardados en el archivo JSON:', products);
};

let productsDB = loadProducts();


// listar todos los productos
router.get('/', (req, res) => {
    console.log('Obteniendo todos los productos');
    const todosLosProductos = productsDB; 
    res.json({ message: 'Lista de todos los productos', products: todosLosProductos });
});


// obtener un producto por ID
router.get('/:pid', (req, res) => {
    const productId = req.params.pid;
    const productoPorId = productsDB.find(producto => producto.id == productId);
    if (!productoPorId) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }
    res.json({ message: 'Producto encontrado', product: productoPorId });
});


// agregar un nuevo producto
router.post('/', (req, res) => {
    console.log('llego solicitud de datos del cuerpo');
        const {
            title,
            description,
            code,
            price,
            stock,
            category,
            thumbnails = [],
        } = req.body;
        
            if (!title || !description || !code || !price || !stock || !category) {
                return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
            }
        
            const newProduct = {
                id: generateUniqueId(),
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails,
            };
        
            productsDB.push(newProduct);
                
            saveProducts(productsDB);
                
            res.status(201).json({ message: 'Producto agregado correctamente', product: newProduct });
        });


// actualizar un producto por ID
router.put('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProductFields = req.body;

const productToUpdate = productsDB.find(product => product.id == productId);

    if (!productToUpdate) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    Object.assign(productToUpdate, updatedProductFields);

    saveProducts(productsDB);

    res.json({ message: 'Producto actualizado correctamente', product: productToUpdate });
});


// eliminar un producto por ID
router.delete('/:pid', (req, res) => {
    const productId = req.params.pid;
    const updatedProductsDB = productsDB.filter(product => product.id != productId);

    if (updatedProductsDB.length === productsDB.length) {
        return res.status(404).json({ error: 'Producto no encontrado.' });
    }

    productsDB.length = 0;
    Array.prototype.push.apply(productsDB, updatedProductsDB);

    saveProducts(updatedProductsDB);

    res.json({ message: 'Producto eliminado correctamente' });
});



module.exports = router;
module.exports.loadProducts = loadProducts;
module.exports.saveProducts = saveProducts;