const e = require('express');
const Usuario = require('../models/usuario');

exports.getAllUsuarios = async (req, res) => {
    try {
        const usuarios = await Usuario.getAll();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getUsuarioById = async (req, res) => {
    try {
        const usuario = await Usuario.getById(req.params.id);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createUsuario = async (req, res) => {
    try {
        const insertId = await Usuario.create(req.body);
        //retornar 
        res.json({ id: insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.updateUsuario = async (req, res) => {
    try {
        await Usuario.update(req.params.id, req.body);
        res.json({ message: "Usuario actualizado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.deleteUsuario = async (req, res) => {
    try {
        await Usuario.delete(req.params.id);
        res.json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.loginUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.login(req.body.idusuario);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.permitidoUsuario = async (req, res) => {
    try {
        const usuario = await Usuario.permitido(req.body.email);
        console.log(usuario);
        if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}