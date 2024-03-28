import mysql from 'mysql2/promise';
import { AuthorType, BookType, generateBooksAndAuthorsObjects } from './bookGenerator.js';
import { TABLE_CON, DB_CON } from '../settings.js';

const CREATE_BOOK_TABLE = `
    CREATE TABLE books (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        year INT,
        isbn VARCHAR(14),
        page_num INT,
        img VARCHAR(255),
        description VARCHAR(800) NOT NULL,
        click INT NOT NULL,
        delete_flag BOOLEAN DEFAULT FALSE,
        delete_date DATETIME
    );
`;

const CREATE_AUTHOR_TABLE = `
    CREATE TABLE authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        lastname VARCHAR(255) NOT NULL
    );
`;

const CREATE_AUTHOR_BOOK_TABLE = `
    CREATE TABLE books_authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        book_id INT,
        author_id INT,
        FOREIGN KEY (book_id) REFERENCES books(id)ON DELETE CASCADE,
        FOREIGN KEY (author_id) REFERENCES authors(id)
    );
`;


function generateInsertValuesToBook(list: BookType[]) {
    const values = list.map(book => `('${book.title}',${book.year}, '${book.isbn}', ${book.pageNum}, '${book.img}', '${book.description}', ${book.click})`);

    const executeParam = `
        INSERT INTO books (title, year, isbn, page_num, img, description, click)
        VALUES ${values.join(',')};
    `;

    return executeParam;
}

function generateInsertValuesToAuthor(list: AuthorType[]) {
    const values = list.map(author => `('${author.name}', '${author.lastname}')`);

    const executeParam = `
        INSERT INTO authors (name, lastname)
        VALUES ${values.join(',')};
    `;

    return executeParam;
}

function generateInsertValuesToBookAndAuthor(len: number) {
    const values: string[] = [];

    for (let i = 0; i < len; i++) {

        const randomNumber = Math.floor(Math.random() * (3 - 1 + 1)) + 1;

        for (let j = 0; j < randomNumber; j++) {
            const book_id = i + 1;
            const author_id = Math.floor(Math.random() * (len - 1)) + 1;
            values.push(`(${book_id}, ${author_id})`);
        }
    }

    const executeParam = `
        INSERT INTO books_authors (book_id, author_id)
        VALUES ${values.join(',')};
    `;

    return executeParam;
}

async function createDB(db: string) {
    const connection: mysql.Connection = await mysql.createConnection(DB_CON);
    connection.execute(`CREATE DATABASE IF NOT EXISTS ${db};`);
    console.log(`DB Tables ${db}`);
    return connection;
}

async function createTables(connection: mysql.Connection, db: string) {

    await connection.changeUser({
        database: db
    })

    await connection.execute(CREATE_BOOK_TABLE);
    await connection.execute(CREATE_AUTHOR_TABLE);
    await connection.execute(CREATE_AUTHOR_BOOK_TABLE);
    console.log("Create Tables");

    return connection;
}

async function insertTables(numberOfValues: number, connection: mysql.Connection,) {
    const obj = generateBooksAndAuthorsObjects(numberOfValues);

    await connection.execute(generateInsertValuesToBook(obj[0] as BookType[]));
    await connection.execute(generateInsertValuesToAuthor(obj[1] as AuthorType[]));
    await connection.execute(generateInsertValuesToBookAndAuthor(obj[0].length));
    console.log("Insert values into Tables");

    await connection.end()
    console.log("Close connection");
}

export { createTables, createDB, insertTables };