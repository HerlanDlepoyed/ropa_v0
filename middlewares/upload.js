// const multer = require('multer');
// const path = require('path');

// // Configurar almacenamiento de imágenes
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
//     },
//     filename: function (req, file, cb) {
//         const ext = path.extname(file.originalname);
//         const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
//         cb(null, uniqueName);
//     }
// });

// // Filtro para asegurarnos de que solo subimos imágenes
// const fileFilter = (req, file, cb) => {
//     console.log("🔍 Tipo de archivo recibido:", file.mimetype); // Agrega esto

//     const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

//     if (!allowedTypes.includes(file.mimetype)) {
//         return cb(new Error('❌ El archivo no es una imagen válida'), false);
//     }
//     cb(null, true);
// };

// const upload = multer({ storage: storage, fileFilter: fileFilter });

// module.exports = upload;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => ({
        folder: 'productos',
        format: 'png', // Puedes cambiarlo según el tipo de archivo
        public_id: `${Date.now()}-${Math.round(Math.random() * 1E9)}`,
    }),
});

// Filtro para permitir solo imágenes
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error('El archivo no es una imagen válida'), false);
    }
    cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

module.exports = upload;
