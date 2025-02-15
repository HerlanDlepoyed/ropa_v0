const express = require('express');
const router = express.Router();
const categoria = require('../controllers/categoriaController')
router.get('/', categoria.getAllCategoria);
router.get('/:id', categoria.getCategoriaById);
router.post('/', categoria.createCategoria);
router.put('/:id', categoria.updateCategoria);
router.delete('/:id', categoria.deleteCategoria);
module.exports = router;
