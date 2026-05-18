import { MongoClient } from 'mongodb';

const uri = "mongodb://Pablo:Pablo123@ac-wqcsgnw-shard-00-00.kbist1w.mongodb.net:27017,ac-wqcsgnw-shard-00-01.kbist1w.mongodb.net:27017,ac-wqcsgnw-shard-00-02.kbist1w.mongodb.net:27017/?ssl=true&replicaSet=atlas-gk60zw-shard-0&authSource=admin&appName=eva-u3-express";
const client = new MongoClient(uri);

let db;

export const conectarAscendente = async () => {
    try {
        await client.connect();
        console.log('Conexión exitosa');
        
        db = client.db('cine-db');
    } catch (error) {
        console.error('Error al conectar:', error);
        process.exit(1); 
    }
};

export const getDB = () => db;