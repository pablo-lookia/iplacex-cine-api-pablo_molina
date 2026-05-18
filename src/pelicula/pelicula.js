import { ObjectId, Int32 } from 'mongodb';

export const Pelicula = {
    _id: ObjectId,
    nombre: String,
    generos: Array,
    anioEstreno: Int32
};

export const mapearPelicula = (data) => {
    return {
        nombre: String(data.nombre),
        generos: Array.isArray(data.generos) ? data.generos : [],
        anioEstreno: new Int32(parseInt(data.anioEstreno))
    };
};