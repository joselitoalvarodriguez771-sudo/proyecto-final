import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '../config/storage.js';
import db from '../models/index.js';

const { Obra, Especialidad, Usuario } = db;

// Generar URL firmada para subir archivos a S3 / R2 / MinIO
export const obtenerUrlSubida = async (req, res) => {
  try {
    const { nombreArchivo, tipoArchivo } = req.body;

    if (!nombreArchivo || !tipoArchivo) {
      return res.status(400).json({ error: 'Faltan nombreArchivo o tipoArchivo' });
    }

    const fileKey = `obras/${Date.now()}-${nombreArchivo}`;

    const command = new PutObjectCommand({
      Bucket: process.env.STORAGE_BUCKET_NAME,
      Key: fileKey,
      ContentType: tipoArchivo,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 900 });
    const publicUrl = `${process.env.STORAGE_PUBLIC_BASE_URL}/${fileKey}`;

    res.json({ uploadUrl, publicUrl, fileKey });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar obra física en el storage y registro en DB
export const eliminarObraConMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const usuarioLogueado = req.usuario || { id_usuario: 1, id_rol: 1 };

    const obra = await Obra.findByPk(id);
    if (!obra) return res.status(404).json({ error: 'Obra no encontrada' });

    const esAdmin = usuarioLogueado.id_rol === 1 || usuarioLogueado.id_rol === 2;
    const esDuenio = obra.id_estudiante === usuarioLogueado.id_usuario;

    if (!esAdmin && !esDuenio) {
      return res.status(403).json({ error: 'No tienes autorización para eliminar esta obra' });
    }

    if (obra.imagen_url) {
      const fileKey = obra.imagen_url.replace(`${process.env.STORAGE_PUBLIC_BASE_URL}/`, '');
      const deleteCommand = new DeleteObjectCommand({
        Bucket: process.env.STORAGE_BUCKET_NAME,
        Key: fileKey,
      });
      await s3Client.send(deleteCommand);
    }

    await obra.destroy();

    res.json({ mensaje: 'Obra y archivo borrados con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// NUEVA FUNCIÓN: Obtener obras agrupadas por Especialidad para el Dashboard de Admin
export const obtenerObrasPorEspecialidades = async (req, res) => {
  try {
    const especialidades = await Especialidad.findAll({
      include: [
        {
          model: Obra,
          include: [
            {
              model: Usuario,
              attributes: ['id_usuario', 'nombres', 'apellidos', 'correo_electronico']
            }
          ]
        }
      ]
    });

    return res.status(200).json(especialidades);
  } catch (error) {
    console.error('Error al obtener obras por especialidad:', error);
    return res.status(500).json({ error: 'Error al consultar las obras por especialidad.' });
  }
};