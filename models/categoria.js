const db = require('../db');

class Categoria {
    static async getAll() {
        try {
            const [rows] = await db.query('SELECT * FROM categorias');
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las categorías: ' + error.message);
        }
    }

    static async getOne(id) {
        try {
            const [rows] = await db.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al obtener la categoría: ' + error.message);
        }
    }

    static async create(nombre) {
        try {
            await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
            return { message: 'Categoría creada exitosamente' };
        } catch (error) {
            throw new Error('Error al crear la categoría: ' + error.message);
        }
    }

    static async update(id, nombre) {
        try {
            await db.query('UPDATE categorias SET nombre = ? WHERE id_categoria = ?', [nombre, id]);
            return { message: 'Categoría actualizada exitosamente' };
        } catch (error) {
            throw new Error('Error al actualizar la categoría: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            await db.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
            return { message: 'Categoría eliminada exitosamente' };
        } catch (error) {
            throw new Error('Error al eliminar la categoría: ' + error.message);
        }
    }
}

module.exports = Categoria;