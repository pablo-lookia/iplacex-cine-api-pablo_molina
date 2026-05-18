import { ObjectId, Int32 } from 'mongodb';

export const Actor = {
    _id: ObjectId,
    idPelicula: String,
    nombre: String,
    edad: Int32,
    estaRetirado: Boolean,
    premios: Array
};

export const mapearActor = (data) => {
    return {
        idPelicula: String(data.idPelicula),
        nombre: String(data.nombre),
        edad: new Int32(parseInt(data.edad)),
        estaRetirado: data.estaRetirado === true || data.estaRetirado === 'true',
        premios: Array.isArray(data.premios) ? data.premios : []
    };
};