const express = require('express');
require('dotenv').config();
const multer = require('multer');
const router = express.Router();
const upload = multer(); // No almacena archivos, solo los procesa
const { v2: cloudinary } = require('cloudinary')
const fs = require('fs');
const path = require('path');
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

router.post('/upload', upload.single('imagen'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ninguna imagen' });
    }

    console.log("📷 Imagen recibida:", req.file);

    try {
        // Subir la imagen a Cloudinary utilizando el buffer de la imagen
        const uploadResult = await cloudinary.uploader.upload_stream(
            { resource_type: 'auto', public_id: 'productos/' + req.file.originalname }, // Guardar en la carpeta productos
           
            (error, result) => {
                if (error) {
                    console.error("❌ Error al subir la imagen a Cloudinary:", error);
                    return res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
                }
                
                // Devuelve la URL de la imagen subida
                res.json({
                    message: "✅ Imagen subida correctamente",
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: result.original_filename,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                });
            }
        );

        // Pasamos el buffer de la imagen al stream
        uploadResult.end(req.file.buffer);

    } catch (error) {
        console.error("❌ Error al subir la imagen a Cloudinary:", error);
        res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
    }
});



router.get('/ping-cloudinary', async (req, res) => {
    // Configura Cloudinary manualmente usando la URL
    cloudinary.config({
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY,
        api_secret: process.env.API_SECRET,
    });

    // Prueba la conexión con Cloudinary
    cloudinary.api.ping()
        .then(result => console.log("✅ Conexión exitosa con Cloudinary:", result))
        .catch(error => console.error("❌ Error en la conexión con Cloudinary:", error));
    try {
        console.log("🔍 Probando conexión con Cloudinary...");

        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary responde:", result);

        res.json({ message: "✅ Conexión con Cloudinary exitosa", result });
    } catch (error) {
        console.error("❌ Error al conectar con Cloudinary:", error);
        res.status(500).json({ error: "❌ No se pudo conectar a Cloudinary", details: error.message });
    }
});

// Configurar multer para almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // Carpeta para las imágenes subidas
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname); // Nombre único para cada archivo
    },
  });
  
  const fileFilter = (req, file, cb) => {
    // Aceptar solo imágenes
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/octet-stream') {
      cb(null, true);
    } else {
      cb(new Error('El archivo no es una imagen válida'), false);
    }
  };
  
  const upload1 = multer({
   storage: storage,
    fileFilter: fileFilter,
   limits: { fileSize: 10 * 1024 * 1024 }, // Limite de 10MB por imagen
  });
  
  // Ruta de prueba para subir una imagen
  router.post('/upload-test', upload.single('imagen'), async (req, res) => {
    console.log("📷 Imagen recibida:", req.file);

    if (!req.file) {
        console.log("🚫 No se ha subido ninguna imagen.");
        return res.status(400).send('No se ha subido ninguna imagen.');
    }

    // Subir la imagen directamente a Cloudinary
    try {
        const uploadResult = await cloudinary.uploader.upload_stream(
            { 
                resource_type: 'auto', 
                public_id: 'productos/' + req.file.originalname // Puedes cambiar 'productos/' si lo necesitas
            },
            (error, result) => {
                if (error) {
                    console.error("❌ Error al subir la imagen a Cloudinary:", error);
                    return res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
                }

                // Enviar la URL de la imagen subida a Cloudinary
                res.json({
                    message: "✅ Imagen subida correctamente",
                    url: result.secure_url,
                    public_id: result.public_id,
                    filename: result.original_filename,
                    mimetype: req.file.mimetype,
                    size: req.file.size
                });
            }
        );

        // Pasamos el buffer de la imagen al stream
        uploadResult.end(req.file.buffer);
    } catch (error) {
        console.error("❌ Error al subir la imagen a Cloudinary:", error);
        res.status(500).json({ error: 'Error al subir la imagen', details: error.message });
    }
});


module.exports = router;
