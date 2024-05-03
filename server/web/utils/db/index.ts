import * as mysql from 'mysql2/promise';
import { DATABASE, HOST, PASSWORD, USERNAME } from '../../../const/db';

export const db = mysql.createPool({
    host: HOST,
    user: USERNAME,
    password: PASSWORD,
    database: DATABASE,
});