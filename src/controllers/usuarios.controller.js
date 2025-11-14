import crypto from 'node:crypto';
import { UsuarioModel } from '../models/usuario.model.js';

const hashPassword = (plainPassword) => {
  const salt = crypto.randomBytes(16);
  const digest = crypto
    .createHash('sha256')
    .update(Buffer.concat([salt, Buffer.from(plainPassword)]))
    .digest('hex');

  return `sha256$${salt.toString('hex')}$${digest}`;
};

/**
 * POST /api/usuarios
 * body: { username, password, rol, id_policia, id_persona }
 */
export const createUsuario = async (req, res) => {
  try {
    const { username, password, rol, id_policia = null, id_persona = null } = req.body;

    if (!username || !password || !rol) {
      return res.status(400).json({
        ok: false,
        message: 'username, password y rol son requeridos',
      });
    }

    const password_hash = hashPassword(password);

    const nuevoUsuario = await UsuarioModel.create({
      username,
      password_hash,
      rol,
      id_policia,
      id_persona,
      activo: true,
    });

    const { password_hash: _, ...safeUser } = nuevoUsuario;

    return res.status(201).json({
      ok: true,
      message: 'Usuario creado correctamente',
      user: safeUser,
    });
  } catch (error) {
    console.error('Error creando usuario:', error.message);
    return res.status(500).json({
      ok: false,
      message: 'Error interno creando usuario',
    });
  }
};
