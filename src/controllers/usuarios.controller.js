import { UsuarioModel } from '../models/usuario.model.js';
import { hashPassword } from '../utils/password.js';

/**
 * GET /api/usuarios
 * Lista usuarios (opcional: solo admin)
 */
export const getUsuarios = async (req, res) => {
  try {
    const { limit = 50, offset = 0 } = req.query;

    const usuarios = await UsuarioModel.findAll({
      limit: Number(limit),
      offset: Number(offset),
    });

    const safe = usuarios.map(({ password_hash, ...rest }) => rest);

    return res.json({
      ok: true,
      usuarios: safe,
    });
  } catch (error) {
    console.error('Error listando usuarios:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo usuarios',
    });
  }
};

/**
 * GET /api/usuarios/:id
 */
export const getUsuarioById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UsuarioModel.findById(id);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado',
      });
    }

    const { password_hash, ...safeUser } = user;

    return res.json({
      ok: true,
      usuario: safeUser,
    });
  } catch (error) {
    console.error('Error obteniendo usuario:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo usuario',
    });
  }
};

/**
 * POST /api/usuarios
 * body: { username, password, rol, id_policia?, id_persona? }
 */
export const createUsuario = async (req, res) => {
  try {
    const { username, password, rol} = req.body;

    if (!username || !password || !rol) {
      return res.status(400).json({
        ok: false,
        message: 'username, password y rol son requeridos',
      });
    }

    const contrasena = hashPassword(password);

    const nuevoUsuario = await UsuarioModel.create({
      username,
      contrasena,
      rol,
      estado: 1,
    });

    const { contrasena: _, ...safeUser } = nuevoUsuario;

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      usuario: safeUser,
    });
  } catch (error) {
    console.error('Error creando usuario:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error creando usuario',
    });
  }
};

/**
 * PUT /api/usuarios/:id
 * Permite actualizar datos del usuario, opcionalmente cambiar password
 */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, contrasena, rol, estado } = req.body;

    const campos = {};

    if (username !== undefined) campos.username = username;
    if (rol !== undefined) campos.rol = rol;
    if (estado !== undefined) campos.estado = 1;

    if (contrasena) {
      campos.contrasena = hashPassword(password);
    }

    if (Object.keys(campos).length === 0) {
      return res.status(400).json({
        ok: false,
        message: 'No hay campos para actualizar',
      });
    }

    const actualizado = await UsuarioModel.update(id, campos);
    const { password, ...safeUser } = actualizado;

    return res.json({
      ok: true,
      message: 'Usuario actualizado correctamente',
      usuario: safeUser,
    });
  } catch (error) {
    console.error('Error actualizando usuario:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error actualizando usuario',
    });
  }
};

/**
 * DELETE /api/usuarios/:id
 * Soft-delete: marca estado = 0
 */
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    const actualizado = await UsuarioModel.update(id, { estado: 0 });
    const { password_hash, ...safeUser } = actualizado;

    return res.json({
      ok: true,
      message: 'Usuario desactivado correctamente',
      usuario: safeUser,
    });
  } catch (error) {
    console.error('Error eliminando usuario:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error eliminando usuario',
    });
  }
};

/**
 * GET /api/usuarios/me
 * Devuelve info del usuario autenticado (según token)
 */
export const getMe = async (req, res) => {
  try {
    const { id_usuario } = req.user;

    const user = await UsuarioModel.findById(id_usuario);
    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado',
      });
    }

    const { password_hash, ...safeUser } = user;

    return res.json({
      ok: true,
      usuario: safeUser,
    });
  } catch (error) {
    console.error('Error en /me:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error obteniendo información de usuario',
    });
  }
};
