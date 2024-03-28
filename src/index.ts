import DBController from "./controllers/dbController.js";
import { ADMIN, ADMIN_URI, DB_CON, DB_NAME, PORT, TABLE_CON } from "./settings.js";
import { BookAuthorType } from "./utils/bookGenerator.js";
import { ResultSetHeader, RowDataPacket } from "mysql2";
import mysql from 'mysql2/promise';

import express, { Router, Express } from "express";
import path, { dirname } from "path";
import AdminRouter from "./routers/adminRouter.js";
import FileRouter from "./routers/fileRouter.js";
import { createDB, createTables, insertTables } from "./utils/createDB.js";
import bodyParser from "body-parser";
import BooksRouter from "./routers/BooksRouter.js";
import { authentication } from "./authenticationMiddleware.js";

// Run when need create a data base.
// insertTables(
//     50,
//     await createTables(
//         await createDB(DB_NAME),
//         DB_NAME
//     )
// );

// insertTables(10, await mysql.createConnection(TABLE_CON));


const server = express();

const adminRouter = new AdminRouter();
const booksRouter = new BooksRouter();
const fileRouter = new FileRouter();

server.use(bodyParser.urlencoded({ extended: false }));
server.use(authentication);

server.use(ADMIN_URI, adminRouter.getRouter());
server.use('/books', booksRouter.getRouter())
server.use('/', fileRouter.getRouter());

server.listen(PORT, () => {
    console.log("Server started");
});

