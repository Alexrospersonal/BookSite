import { AuthorType, BookType } from "../utils/bookGenerator.js";
import { Book, TABLE_CON_TYPE } from "../settings.js";
import mysql, { ResultSetHeader } from 'mysql2/promise';


class DBController {

    private conn: mysql.Connection | null = null;
    private connObj: TABLE_CON_TYPE;

    private querysObj = {
        queryBookById: `
            SELECT * FROM books
            WHERE id = ?;
        `,
        queryListOfBooks: `
        SELECT id, title, year, isbn, page_num, img, description, click FROM books
        WHERE delete_flag = FALSE
        LIMIT ? OFFSET ?;
        `,
        queryFindBooksByTitle: `
            SELECT *
            FROM books
            WHERE books.title LIKE
        `,
        queryfindBooksByIdAuthor: `
            SELECT *
            FROM books_authors
            JOIN authors ON books_authors.author_id = authors.id
            JOIN books ON books_authors.book_id = books.id
            WHERE books.delete_flag = FALSE AND authors.id = ?;
        `,
        queryfindBooksByYear: `
            SELECT *
            FROM books_authors
            JOIN authors ON books_authors.author_id = authors.id
            JOIN books ON books_authors.book_id = books.id
            WHERE books.delete_flag = FALSE AND books.year = ?;
        `,
        querySoftDeleteBook: `
            UPDATE books
            SET delete_flag = true, delete_date = NOW()
            WHERE books.delete_flag = FALSE AND id = ?;
        `,
        queryGetNumberOfPages: `
            SELECT COUNT(*) AS total FROM books;
        `,
        queryGetAuthorsByBookId: `
            SELECT authors.name, authors.lastname
            FROM books_authors
            JOIN authors ON books_authors.author_id = authors.id
            WHERE books_authors.book_id = ?;
        `,
        queryIncreaseClick: `
            UPDATE books
            SET click = click + 1
            WHERE id = ?;
        `
    }

    public constructor(connObj: TABLE_CON_TYPE) {
        this.connObj = connObj;
    }

    public async createConnection() {
        this.conn = await mysql.createConnection(this.connObj);
    }

    public async createNewBook(book: BookType, authors: string[]) {
        const authorQuery = 'INSERT INTO authors (name, lastname) VALUES (?, ?)';
        const bookQuery = 'INSERT INTO books (title, year, isbn, page_num, img, description, click) VALUES (?, ?, ?, ?, ?, ?, ?)';
        const booksAuthorsQuery = 'INSERT INTO books_authors (author_id, book_id) VALUES (?, ?)';

        if (this.validateConnection(this.conn)) {
            try {
                const BookRespo = await this.conn.query(bookQuery, [book.title, book.year, book.isbn, book.pageNum, book.img, book.description, book.click]);

                const authorsId: ResultSetHeader[] = [];

                for (const author of authors) {
                    const [name, lastname] = author.split(" ");
                    const AuthorResponse = await this.conn.query(authorQuery, [name, lastname]);
                    if (this.validateResponseObject(AuthorResponse)) {
                        authorsId.push(AuthorResponse);
                    }
                }

                for (const authorRespObj of authorsId) {
                    if (this.validateResponseObject(BookRespo)) {
                        await this.conn.query(booksAuthorsQuery, [authorRespObj.insertId, BookRespo.insertId]);
                    }
                }
            } catch (error) {
                console.error('Помилка при виконанні запиту:', error);
            }
        }
    }

    private validateResponseObject(obj: any): obj is ResultSetHeader {
        return Array.isArray(obj) && "insertId" in obj[0];
    }

    public async getBookById(id: number) {
        const book = await this.getQuery(this.querysObj.queryBookById, [id.toString()]);
        let authors: string[] = [];
        if (Array.isArray(book) && this.validateDbBook(book[0])) {
            const authorsResult = await this.getAuthorsByBookId(book[0].id);

            if (Array.isArray(authorsResult)) {
                authors = authorsResult.map((obj) => `${(obj as AuthorType).name} ${(obj as AuthorType).lastname}`);
            }
            return {
                id: book![0].id,
                title: book![0].title,
                description: book![0].description,
                click: book![0].click,
                isbn: book![0].isbn,
                img: book![0].img,
                page_num: book![0].page_num,
                year: book![0].year,
                authors: [...authors]
            }
        }

        return null;
    }

    public async getListOfBooks(num: number, offset: number) {
        const queryList = await this.getQuery(this.querysObj.queryListOfBooks, [num, offset]);
        let bookList: Book[] = [];

        if (queryList && Array.isArray(queryList)) {
            await this.getBookWithAuthros(queryList, bookList);
        }

        return bookList;
    }

    private validateDbBook(book: any): book is Book {
        return "title" in book;
    }

    private async getBookWithAuthros(queryList: Array<unknown>, bookList: Book[]) {

        for (let i = 0; i < queryList.length; i++) {
            const book = queryList[i];

            if (this.validateDbBook(book)) {
                const authorsResult = await this.getAuthorsByBookId(book.id);
                let authors: string[] = [];

                if (Array.isArray(authorsResult)) {
                    authors = authorsResult.map((obj) => `${(obj as AuthorType).name} ${(obj as AuthorType).lastname}`);
                }

                bookList.push({
                    id: book!.id,
                    title: book!.title,
                    description: book!.description,
                    click: book!.click,
                    isbn: book!.isbn,
                    img: book!.img,
                    page_num: book!.page_num,
                    year: book!.year,
                    authors: [...authors]
                });
            }
        }
    }

    public async getAuthorsByBookId(id: number) {
        return await this.getQuery(this.querysObj.queryGetAuthorsByBookId, [id]);
    }

    public async getNumberOfPages() {
        return await this.getQuery(this.querysObj.queryGetNumberOfPages, []);
    }

    public async findBooksByTitle(str: string) {
        const queryStr = this.querysObj.queryFindBooksByTitle + `'% ${str} %';`;
        const queryList = await this.getQuery(queryStr, []);

        let bookList: Book[] = [];

        if (queryList && Array.isArray(queryList)) {
            await this.getBookWithAuthros(queryList, bookList);
        }

        return bookList;
    }

    public async findBooksByIdAuthor(id: number) {
        return await this.getQuery(this.querysObj.queryfindBooksByIdAuthor, [id]);
    }

    public async findBooksByYear(year: number) {
        return await this.getQuery(this.querysObj.queryfindBooksByYear, [year]);
    }

    public async closeConnection() {
        if (this.validateConnection(this.conn)) {
            this.conn.end();
        }
    }

    public async deleteBook(id: number) {
        return await this.getQuery(this.querysObj.querySoftDeleteBook, [id]);
    }

    public async increaseClick(id: number) {
        return await this.getQuery(this.querysObj.queryIncreaseClick, [id]);
    }

    private validateConnection(conn: mysql.Connection | null): conn is mysql.Connection {
        return conn !== null;
    }

    private async getQuery(query: string, params: string[] | number[]) {
        if (this.validateConnection(this.conn)) {
            try {
                const [rows, _] = await this.conn.query(query, [...params]);
                return rows;
            } catch (error) {
                console.error('Помилка при виконанні запиту:', error);
                return null;
            }
        }
        return null;
    }
}

export default DBController;
export { Book };