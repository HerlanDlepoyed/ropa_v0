const categoria = require('../models/categoria');

exports.getAllCategoria = async (req, res) => {
    try {
        const categorias = await categoria.getAll();
        res.status(200).json(categorias);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getCategoriaById = async (req, res) => {
    try {
        const categoriaData = await categoria.getOne(req.params.id);
        if (!categoriaData) {
            return res.status(404).json({ error: "Categoría no encontrada" });
        }
        res.status(200).json(categoriaData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createCategoria = async (req, res) => {
    console.log('Body recibido:', req.body);
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }
        
        await categoria.create(nombre); // No devuelve un ID en tu modelo actual
        res.status(200).json({ message: "Categoría creada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateCategoria = async (req, res) => {
    try {
        const { nombre } = req.body;
        if (!nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        await categoria.update(req.params.id, nombre);
        res.status(200).json({ message: "Categoría actualizada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteCategoria = async (req, res) => {
    try {
        await categoria.delete(req.params.id);
        res.status(200).json({ message: "Categoría eliminada exitosamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
