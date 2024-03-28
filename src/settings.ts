type DB_CON_TYPE = {
    host: string,
    user: string,
    password: string,
}

type TABLE_CON_TYPE = {
    database: string
} & DB_CON_TYPE;

type Book = {
    id: number,
    title: string,
    description: string,
    click: number,
    isbn: string,
    img: string,
    page_num: number,
    year: number,
    authors: string[]
}

const DB_CON: DB_CON_TYPE = {
    host: 'localhost',
    user: 'root',
    password: '123456'
}

const DB_NAME = 'books_site';

const TABLE_CON: TABLE_CON_TYPE = {
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: DB_NAME
}

const ADMIN = {
    username: "Alex",
    password: "123"
}

const STATIC = 'src\\static\\';

const PORT = 3000;
const BASE_PATH = `http://localhost:${PORT}`;
const ADMIN_URI = "/admin/api/v1/";

export { TABLE_CON, DB_CON, DB_NAME, TABLE_CON_TYPE, PORT, BASE_PATH, ADMIN_URI, ADMIN, STATIC, Book };
