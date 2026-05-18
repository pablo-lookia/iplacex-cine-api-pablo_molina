import { ObjectId, Int32 } from 'mongodb';
import { getDB } from '../common/db.js';
import { mapearActor } from './actor.js';

const actorCollection = 'actores';

export const handleInsertActorRequest = async (req, res) => {
    let db = getDB();
    let peliculaId;

    try {
        peliculaId = new ObjectId(req.body.idPelicula);
    } catch (error) {
        return res.status(400).json({ error: 'El idPelicula proporcionado está mal formado' });
    }

    db.collection('peliculas').findOne({ _id: peliculaId })
        .then((peliculaEncontrada) => {
            if (!peliculaEncontrada) {
                return res.status(400).json({ error: 'Validación fallida: La película asignada no existe' });
            }

            let nuevoActor = mapearActor(req.body);

            db.collection(actorCollection).insertOne(nuevoActor)
                .then((resultado) => {
                    res.status(201).json({ mensaje: 'Actor agregado con éxito', id: resultado.insertedId });
                })
                .catch((error) => {
                    res.status(500).json({ error: 'Error interno al guardar el actor en la base de datos' });
                });
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al consultar la colección de películas' });
        });
};

export const handleGetActoresRequest = async (req, res) => {
    let db = getDB();

    db.collection(actorCollection)
        .find({})
        .toArray()
        .then((actores) => {
            // Código 200: Éxito
            res.status(200).json(actores);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener los actores' });
        });
};

export const handleGetActorByIdRequest = async (req, res) => {
    let id = req.params.id;
    let objectId;

    try {
        objectId = new ObjectId(id);
    } catch (error) {
        return res.status(400).json({ error: 'Id mal formado' });
    }

    let db = getDB();
    db.collection(actorCollection)
        .findOne({ _id: objectId })
        .then((actor) => {
            if (!actor) {
                return res.status(404).json({ error: 'Actor no encontrado' });
            }
            res.status(200).json(actor);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al buscar el actor' });
        });
};

export const handleGetActoresByPeliculaIdRequest = async (req, res) => {
    let idDeLaPelicula = req.params.pelicula;
    let db = getDB();

    db.collection(actorCollection)
        .find({ idPelicula: idDeLaPelicula })
        .toArray()
        .then((actores) => {
            res.status(200).json(actores);
        })
        .catch((error) => {
            res.status(500).json({ error: 'Error al obtener los actores asociados a la película' });
        });
};