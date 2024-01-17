import { Sequelize } from "sequelize";
import pg from 'pg';

export default new Sequelize(process.env.POSTGRES_URL, {
    dialect: 'postgres', dialectModule: pg, 
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});