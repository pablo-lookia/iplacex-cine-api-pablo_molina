import express from 'express';
import cors from 'cors';
import { conectarAscendente } from './src/common/db.js';
import peliculaRoutes from './src/pelicula/routes.js'; 
import ActorRoutes from './src/actor/routes.js';

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Bienvenido al cine Iplacex');
});

app.use('/api', peliculaRoutes);
app.use('/api', ActorRoutes);

conectarAscendente()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor Express en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error al iniciar el servidor:', error);
    });