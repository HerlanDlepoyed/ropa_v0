const db = require('../db');
const cloudinary = require('../config/cloudinary'); // Ajusta la ruta según tu estructura

class ProductoImagen {
    static async getImagenesProductoId(producto_id) {
        const [rows] = await db.query('SELECT * FROM producto_imagenes WHERE producto_id = ?', [producto_id]);
        return rows;
    }

    // Actualización de la función `addImage` para guardar la URL de la imagen subida a Cloudinary en la base de datos
    static async addImage(producto_id, imagen_url) {
        const [result] = await db.query(
            'INSERT INTO producto_imagenes (producto_id, imagen_url) VALUES (?, ?)',
            [producto_id, imagen_url]
        );
        return result.insertId;
    }

    // static async deleteImage(imagen_id) {
    //     // Primero, obtenemos la URL de la imagen para poder eliminarla del sistema de archivos
    //     const [image] = await db.query('SELECT imagen_url FROM producto_imagenes WHERE imagen_id = ?', [imagen_id]);
    //     if (image.length === 0) {
    //         throw new Error('Imagen no encontrada');
    //     }

    //     // Eliminamos la imagen del sistema de archivos
    //     const fs = require('fs');
    //     const path = require('path');
    //     const imagePath = path.join(__dirname, '..', image[0].imagen_url);
    //     fs.unlinkSync(imagePath);

    //     // Obtener el public_id de la URL de Cloudinary
    //     const imageUrl = image[0].imagen_url;
    //     const publicId = imageUrl.split('/').pop().split('.')[0]; // Extrae el public_id

    //     // Eliminar de Cloudinary
    //     await cloudinary.uploader.destroy(publicId);
    //     await db.query('DELETE FROM producto_imagenes WHERE imagen_id = ?', [imagen_id]);
    // }
    static async getImagesByProductoId(productoId) {
        const [rows] = await db.query(
            'SELECT imagen_url FROM producto_imagenes WHERE producto_id = ?',
            [productoId]
        );
        return rows;
    }
    static async deleteImage(imagen_id) {
        try {
            
            const [image] = await db.query('SELECT imagen_url FROM producto_imagenes WHERE imagen_id = ?', [imagen_id]);

            if (image.length === 0) {
                throw new Error('Imagen no encontrada');
            }

            // Obtener el public_id de la URL de Cloudinary
            const imageUrl = image[0].imagen_url;

            // Extraer el `public_id` de la URL
            const publicId = imageUrl
                .split('/')
                .slice(-2)
                .join('/')
                .split('.')[0]; // Ejemplo: 'productos/1739555042719-157257479'
    
            // Eliminar de Cloudinary
            console.log(imageUrl);
            console.log(publicId);
            await cloudinary.uploader.destroy(publicId);

            // Eliminar de la base de datos
            await db.query('DELETE FROM producto_imagenes WHERE imagen_id = ?', [imagen_id]);
        } catch (error) {
            console.error("❌ Error al eliminar imagen:", error);
            throw error;
        }
    }


}

module.exports = ProductoImagen;
