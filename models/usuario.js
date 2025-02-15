const db = require('../db');

class Usuario {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM usuarios');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ nombre, email, idusuario, imagen }) {
        const [result] = await db.query(
            'INSERT INTO usuarios (nombre, email, idusuario, imagen) VALUES (?, ?, ?, ?)',
            [nombre, email, idusuario, imagen]
        );
        return result.insertId;
    }

    static async update(id, { nombre, email, idusuario, imagen }) {
        await db.query(
            'UPDATE usuarios SET nombre = ?, email = ?, idusuario = ?, imagen = ? WHERE id = ?',
            [nombre, email, idusuario, imagen, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    }
    //usar login pero el login solamente sera si el idusario recivo es igual al idusuario de la tabla usuarios
    static async login(idusuario) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE idusuario = ?', [idusuario]);
        return rows[0];
    }
    //usar un static de manera que devulva un codiggo que yo escribo que es el siguiente sipermitido solo si el correo es igual al correo de la tabla usuarios y es el que quiero permitir
    static async permitido(email) {
        const [rows] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
        if (rows.length == 0) {

            return -1;

        } else if (rows[0].email == "ballon777herlanturpo@gmail.com") {

            return 1;
        } else {

            return 0;
        }
    }

}

module.exports = Usuario;
