import { Sequelize } from 'sequelize';

export default new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        dialect: 'postgres',
        gost: process.env.DB_HOST,
        port: process.env.DB_PORT,
    }
);
