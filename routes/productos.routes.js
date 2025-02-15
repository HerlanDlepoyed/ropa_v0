const express = require('express');
const router = express.Router();
const productosController = require('../controllers/productosController');
const upload = require('../middlewares/upload');
const uploadImageNube = require('../middlewares/uploadsnube');

router.post('/api/uploadnube', uploadImageNube.uploadNube.single('imagen'), uploadImageNube.uploadImageToCloudinary);
router.delete('/deletenube/:id', uploadImageNube.deleteImageFromCloudinary);
router.get('/getnube', uploadImageNube.getImagesFromCloudinary);
router.post('/upload', upload.single('imagen'), productosController.uploadImage);
router.get('/', productosController.getAllProductos);
router.get('/:id', productosController.getProductoById);
router.post('/', productosController.createProducto);
router.put('/:id', productosController.updateProducto);
router.delete('/:id', productosController.deleteProducto);
router.get('/imagenes/:id', productosController.getImagenesProductoId);
router.delete('/imagenes/:id', productosController.deleteImage);



module.exports = router;
