const { v2: cloudinary } = require('cloudinary');
const pool = require('../db');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configurar Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

// Configurar almacenamiento en Cloudinary
// Configurar Cloudinary Storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'productos', // Carpeta en Cloudinary
        format: 'png', // Convertir a PNG o cualquier otro formato
        public_id: Date.now() + '-' + Math.round(Math.random() * 1E9), // Crear un public_id único
    }),
});

const fileFilter = (req, file, cb) => {
    console.log("🔍 Cloudinary Config:", {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET ? "OK" : "MISSING"
    });
    
    console.log("🔍 Tipo de archivo recibido:", file.mimetype); // Agrega esto

   const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg','application/octet-stream'];


    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('❌ El archivo no es una imagen válida'), false);
    }
    cb(null, true);
};
const uploadNube = multer({ storage: storage ,fileFilter: fileFilter });

// 🚀 **1. Subir imagen a Cloudinary y guardar en MySQL**
const uploadImageToCloudinary = async (req, res) => {
    try {
        console.log("👀 req.body:", req.body);
        console.log("👀 req.file:", req.file);  // Ver qué archivo está recibiendo

        if (!req.file) {
            return res.status(400).json({ error: 'No se subió ninguna imagen' });
        }

        const { path, filename } = req.file;
        console.log(`✅ Imagen subida. Path: ${path}, Filename: ${filename}`);

        const [result] = await pool.query(
            'INSERT INTO imagen_nube (public_id, url) VALUES (?, ?)',
            [filename, path]
        );

        res.json({ message: 'Imagen subida y guardada en la BD', imageUrl: path, id: result.insertId });
    } catch (error) {
        console.error("❌ Error al subir imagen:", error);
        res.status(500).json({ error: 'Error al subir la imagen' });
    }
};




// 🚀 **2. Eliminar imagen de Cloudinary y de MySQL**
const deleteImageFromCloudinary = async (req, res) => {
    try {
        const { id } = req.params;

        // Buscar la imagen en la base de datos
        const [rows] = await pool.query('SELECT public_id FROM imagen_nube WHERE id = ?', [id]);

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Imagen no encontrada en la BD' });
        }

        const public_id = rows[0].public_id;

        // Eliminar de Cloudinary
        await cloudinary.uploader.destroy(public_id);

        // Eliminar de la base de datos
        await pool.query('DELETE FROM imagen_nube WHERE id = ?', [id]);

        res.json({ message: 'Imagen eliminada de Cloudinary y de la BD' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la imagen' });
    }
};
const getImagesFromCloudinary = async (req, res) => {
   
    try {
        const [rows] = await pool.query('SELECT * FROM imagen_nube');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener las imágenes' });
    }
};

module.exports = {
    uploadImageToCloudinary,
    deleteImageFromCloudinary,
    getImagesFromCloudinary,
    uploadNube
};
