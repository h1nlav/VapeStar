import { } from 'dotenv/config';
import express from 'express';
import cors from 'cors';
import sequelize from './db/index.js';
import router from './routes/index.js'
import errorHandler from './middlewares/errorHandler.js';
import fileUpload from 'express-fileupload';
import { fileURLToPath } from 'url';
import * as path from 'path';

const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/api', router);
app.use('/api/img', express.static(path.resolve(__dirname, 'static')));
app.use(errorHandler);


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, () => console.log(`SERVER STARTED ON PORT ${PORT}`))
    } catch (err) {
        console.log(err);
    }
}


start();