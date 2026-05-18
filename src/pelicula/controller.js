import { ObjectId, Int32 } from 'mongodb';
import { getDB } from '../common/db.js';
import { mapearPelicula } from './pelicula.js';

// Constante global requerida para definir el nombre de la colección
const peliculaCollection = 'peliculas';

export const handleInsertPeliculaRequest = async (req, res) => {
    let db = getDB();
    
    // Aplicamos el tipado estricto mapeando los datos de la petición
    let nuevaPelicula = mapearPelicula(req.body);

    db.collection(peliculaCollection)
        .insertOne(nuevaPelicula)
        .then((resultado) => {
            // Código 201: Recurso creado con éxito
            res.status(201).json({ mensaje: 'Película agregada con éxito', id: resultado.insertedId });
        })
        .catch((error) => {
            // Código 500: Error interno del servidor
            res.status(500).json({ error: 'Error al guardar la película' });
        });
};

export const handleGetPeliculasRequest = async (req, res) => {
    let db = getDB();

    db.collection(peliculaCollection)
        .find({})
        .toArray()
        .then((peliculas) => {
            // Código 200: Éxito
            res.status(200).json(peliculas);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener las películas' });
        });
};

export const handleGetPeliculaByIdRequest = async (req, res) => {
    let id = req.params.id;
    let objectId;

    // Validación obligatoria con try-catch para capturar el error de ID mal formado
    try {
        objectId = new ObjectId(id);
    } catch (error) {
        // Código 400: Bad Request
        return res.status(400).json({ error: 'Id mal formado' });
    }

    let db = getDB();
    db.collection(peliculaCollection)
        .findOne({ _id: objectId })
        .then((pelicula) => {
            if (!pelicula) {
                // Código 404: Recurso no encontrado
                return res.status(404).json({ error: 'Película no encontrada' });
            }
            res.status(200).json(pelicula);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al buscar la película' });
        });
};

export const handleUpdatePeliculaByIdRequest = async (req, res) => {
    let id = req.params.id;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (error) {
        return res.status(400).json({ error: 'Id mal formado' });
    }

    let db = getDB();
    
    // Mapeamos de forma segura y estricta solo las propiedades enviadas para actualizar
    let datosActualizar = {};
    if (req.body.nombre !== undefined) datosActualizar.nombre = String(req.body.nombre);
    if (req.body.generos !== undefined) datosActualizar.generos = Array.isArray(req.body.generos) ? req.body.generos : [];
    if (req.body.anioEstreno !== undefined) datosActualizar.anioEstreno = new Int32(parseInt(req.body.anioEstreno));

    db.collection(peliculaCollection)
        // Uso obligatorio del operador $set requerido por la pauta
        .updateOne({ _id: objectId }, { $set: datosActualizar })
        .then((resultado) => {
            if (resultado.matchedCount === 0) {
                return res.status(404).json({ error: 'Película no encontrada' });
            }
            res.status(200).json({ mensaje: 'Película actualizada correctamente' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al actualizar la película' });
        });
};

export const handleDeletePeliculaByIdRequest = async (req, res) => {
    let id = req.params.id;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (error) {
        return res.status(400).json({ error: 'Id mal formado' });
    }

    let db = getDB();

    db.collection(peliculaCollection)
        .deleteOne({ _id: objectId })
        .then((resultado) => {
            if (resultado.deletedCount === 0) {
                return res.status(404).json({ error: 'Película no encontrada' });
            }
            res.status(200).json({ mensaje: 'Película eliminada correctamente' });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al eliminar la película' });
        });
};