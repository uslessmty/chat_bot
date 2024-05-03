"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mysql = require("mysql2/promise");
const db_1 = require("../../../const/db");
exports.db = mysql.createPool({
    host: db_1.HOST,
    user: db_1.USERNAME,
    password: db_1.PASSWORD,
    database: db_1.DATABASE,
});
