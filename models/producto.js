const db = require('../db');
const { v2: cloudinary } = require('cloudinary');
class Producto {
    // Obtener todos los productos
    static async getAll() {
        try {
            const query = `
                SELECT 
                    p.*, 
                    (SELECT pi.imagen_url 
                     FROM producto_imagenes pi 
                     WHERE pi.producto_id = p.productos_id  -- Ajuste de clave foránea
                     ORDER BY pi.imagen_id ASC 
                     LIMIT 1) AS imagen
                FROM productos p
            `;

            const [rows] = await db.query(query);
            return rows;
        } catch (err) {
            throw new Error(`Error al obtener productos: ${err.message}`);
        }
    }


    // Obtener un producto por ID
    static async getById(id) {
        try {
            const [rows] = await db.query('SELECT * FROM productos WHERE productos_id = ?', [id]);
            return rows[0];
        } catch (err) {
            throw new Error(`Error al obtener producto con ID ${id}: ${err.message}`);
        }
    }

    // Crear un nuevo producto
    static async create({ nombre, descripcion = null, precio, categoria, rating = null, stock = null, oferta = null }) {
        try {
            const [result] = await db.query(
                'INSERT INTO productos (nombre, descripcion, precio, categoria, rating, stock, oferta) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre, descripcion, precio, categoria, rating, stock, oferta]
            );
            return result.insertId;
        } catch (err) {
            throw new Error(`Error al crear producto: ${err.message}`);
        }
    }

    // Actualizar un producto existente
    static async update(id, { nombre, descripcion = null, precio, categoria, rating = null, stock = null, oferta = null }) {
        try {
            await db.query(
                'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, categoria = ?, rating = ?, stock = ?, oferta = ? WHERE productos_id = ?',
                [nombre, descripcion, precio, categoria, rating, stock, oferta, id]
            );
        } catch (err) {
            throw new Error(`Error al actualizar producto con ID ${id}: ${err.message}`);
        }
    }

    // Eliminar un producto
    static async delete(productId) {
        try {
            // Obtener todas las imágenes asociadas al producto
            const [images] = await db.query('SELECT imagen_url, imagen_id FROM producto_imagenes WHERE producto_id = ?', [productId]);
    
            if (images.length === 0) {
                throw new Error('No hay imágenes asociadas a este producto');
            }
    
            // Eliminar las imágenes de Cloudinary y luego de la base de datos
            for (const image of images) {
                const imageUrl = image.imagen_url;
    
                // Extraer el public_id de la URL de Cloudinary
                const publicId = imageUrl
                    .split('/')
                    .slice(-2)
                    .join('/')
                    .split('.')[0]; // Ejemplo: 'productos/1739555042719-157257479'
    
                // Eliminar la imagen de Cloudinary
                console.log(`Eliminando imagen de Cloudinary: ${publicId}`);
                await cloudinary.uploader.destroy(publicId);
    
                // Eliminar la imagen de la base de datos
                await db.query('DELETE FROM producto_imagenes WHERE imagen_id = ?', [image.imagen_id]);
            }
    
            // Ahora que todas las imágenes han sido eliminadas, eliminamos el producto de la base de datos
            await db.query('DELETE FROM productos WHERE productos_id = ?', [productId]);
    
        } catch (err) {
            throw new Error(`Error al eliminar el producto con ID ${productId}: ${err.message}`);
        }
    }
    

}

module.exports = Producto;
