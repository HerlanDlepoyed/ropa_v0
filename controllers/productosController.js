const exp = require('constants');
const Producto = require('../models/Producto');
const ProductoImagen = require('../models/productoimagen');
const path = require('path');
const { v2: cloudinary } = require('cloudinary');

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

exports.getAllProductos = async (req, res) => {
    try {
        const productos = await Producto.getAll();
        res.json(productos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getProductoById = async (req, res) => {
    try {
        const producto = await Producto.getById(req.params.id);
        if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

        // Obtener imágenes del producto
        const imagenes = await ProductoImagen.getImagesByProductoId(req.params.id);
        producto.imagenes = imagenes; // Agregar imágenes al producto

        res.json(producto);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createProducto = async (req, res) => {
    try {
        const insertId = await Producto.create(req.body);
        res.json({ id: insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateProducto = async (req, res) => {
    try {
        await Producto.update(req.params.id, req.body);
        res.json({ message: "Producto actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteProducto = async (req, res) => {
    try {
        await Producto.delete(req.params.id);
        res.json({ message: "Producto eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// exports.uploadImage = async (req, res) => {
//     console.log('req:', req.body);
//     try {
//         if (!req.file) {
//             return res.status(400).json({ error: 'No se subió ninguna imagen' });
//         }

//         const imagen_url = `/uploads/${req.file.filename}`;
//         const producto_id = req.body.producto_id;

//         if (!producto_id) {
//             return res.status(400).json({ error: 'Se requiere el ID del producto' });
//         }

//         const insertId = await ProductoImagen.addImage(producto_id, imagen_url);
//         res.json({ id: insertId, imagen_url });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

exports.uploadImage = async (req, res) => {
    try {
        // Verificamos si el archivo fue cargado
        if (!req.file) {
            console.log('No se subió ninguna imagen');
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }

        // Obtener el producto_id desde la solicitud
        const { producto_id } = req.body;
        if (!producto_id) {
            console.log('No se proporcionó el ID del producto');
            return res.status(400).json({ error: 'Se requiere el ID del producto' });
        }

        // URL de la imagen en Cloudinary
        const imagen_url = req.file.path;

        // Guardar en la base de datos
  
        const insertId = await ProductoImagen.addImage(producto_id, imagen_url);
        res.json({ id: insertId, imagen_url });
    } catch (error) {
        console.error("Error al subir la imagen:", error);
        res.status(500).json({ error: error.message });
    }
};
// exports.deleteImage = async (req, res) => {
//     try {
//         await ProductoImagen.deleteImage(req.params.id);
//         res.json({ message: "Imagen eliminada" });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
// Función para eliminar imagen de Cloudinary y de la base de datos
exports.deleteImage = async (req, res) => {
    try {
        await ProductoImagen.deleteImage(req.params.id);
        res.json({ message: 'Imagen eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        res.status(500).json({ error: error.message });
    }
};
exports.getImagenesProductoId = async (req, res) => {
    try {
        const imagenes = await ProductoImagen.getImagenesProductoId(req.params.id);
        res.json(imagenes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
