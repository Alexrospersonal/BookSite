import express, { Router, Request, Response } from "express";
import DBController, { Book } from "../controllers/dbController.js";
import { TABLE_CON } from "../settings.js";
import ViewController from "../controllers/viewController.js";
import BaseRouter from "../utils/generic.js";

export default class BooksRouter implements BaseRouter {
    private readonly ROUTER: Router;
    private readonly BOOK_NUMBER = 20;
    private readonly DB_CON = new DBController(TABLE_CON);

    constructor() {
        this.ROUTER = express.Router();
        this.ROUTER.get('/', this.getBooks);
        this.ROUTER.post('/', this.findBooks);
        this.ROUTER.get('/book/:id', this.getBook);
        this.ROUTER.get('/clicks/:id', this.increaseClick);
        this.DB_CON.createConnection();
    }

    public increaseClick = async (req: Request, res: Response) => {
        if ('id' in req.params) {
            await this.DB_CON.increaseClick(+req.params.id);
            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }
    }

    public findBooks = async (req: Request, res: Response) => {
        const searchVal = req.body.search;
        const books = await this.DB_CON.findBooksByTitle(searchVal);

        const numberOfPages = Math.ceil(books.length / this.BOOK_NUMBER);

        if (Array.isArray(books)) {
            const html = await ViewController.buildMainSitePage(books, numberOfPages, 1);
            res.send(html);
        } else {
            res.sendStatus(500);
        }
    }

    public getRouter = () => {
        return this.ROUTER;
    }

    private getBook = async (req: Request, res: Response) => {
        if ('id' in req.params) {
            const book = await this.DB_CON.getBookById(+req.params.id);
            if (this.validateBookType(book)) {
                const html = await ViewController.buildBookPage(book);
                res.send(html);
            }
        } else {
            res.sendStatus(404);
        }
    }

    private validateBookType(book: any): book is Book {
        return 'title' in book;
    }

    private getBooks = async (req: Request, res: Response) => {

        const offsetNumber: number = this.validateOffset(req.query.offset) ? +req.query.offset : 1;

        const resultBookList = await this.DB_CON.getListOfBooks(
            this.BOOK_NUMBER, (offsetNumber - 1) * this.BOOK_NUMBER
        );

        const numberOfPages = await this.getMaxPage();

        if (Array.isArray(resultBookList)) {
            const html = await ViewController.buildMainSitePage(resultBookList, numberOfPages, offsetNumber);
            res.send(html);
        } else {
            res.sendStatus(500);
        }
    }

    private validateOffset(offset: unknown): offset is string {
        return typeof offset === "string";
    }

    private async getMaxPage() {
        const resultNumberOfPages = await this.DB_CON.getNumberOfPages();

        let numOfBooks = 1;

        if (Array.isArray(resultNumberOfPages) && this.validateTotalResult(resultNumberOfPages[0]))
            numOfBooks = resultNumberOfPages[0].total;

        return Math.ceil(numOfBooks / this.BOOK_NUMBER);
    }

    private validateTotalResult(obj: any): obj is { [key: string]: number } {
        return 'total' in obj;
    }
}