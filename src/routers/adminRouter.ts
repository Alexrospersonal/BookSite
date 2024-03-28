import express, { Router, Request, Response } from "express";
import BaseRouter from "../utils/generic.js";
import DBController from "../controllers/dbController.js";
import { ADMIN_URI, BASE_PATH, TABLE_CON } from "../settings.js";
import ViewController from "../controllers/viewController.js";
import { BookType } from "../utils/bookGenerator.js";

class AdminRouter implements BaseRouter {
    private readonly ROUTER: Router;
    private readonly BOOK_NUMBER = 20;
    private readonly DB_CON = new DBController(TABLE_CON);

    public constructor() {
        this.ROUTER = express.Router();
        this.ROUTER.get('/', this.getAdminPanel);
        this.ROUTER.post('/', this.createBook);
        this.DB_CON.createConnection();
    }

    private createBook = async (req: Request, res: Response) => {
        const book: BookType = {
            title: req.body.title,
            year: +req.body.year,
            isbn: req.body.isbn,
            pageNum: req.body.pages,
            img: `/images/books/${req.body.download_img}`,
            click: 0,
            description: req.body.describe
        }

        const authros: string[] = [];

        for (const author of [req.body.author_1, req.body.author_2, req.body.author_3]) {
            if (author.trim().length > 0) {
                authros.push(author)
            }
        }

        await this.DB_CON.createNewBook(book, authros);
        res.redirect(BASE_PATH + ADMIN_URI);
    }

    private getAdminPanel = async (req: Request, res: Response) => {

        const value = Object.values((req.query))[0];
        const key = Object.keys((req.query))[0];

        if (key === 'delete' && typeof value === "string") {
            await this.DB_CON.deleteBook(+value);
        }

        const offsetNumber: number = this.validateOffset(req.query.offset) ? +req.query.offset : 1;

        const resultBookList = await this.DB_CON.getListOfBooks(
            this.BOOK_NUMBER, (offsetNumber - 1) * this.BOOK_NUMBER
        );

        const numberOfPages = await this.getMaxPage();

        if (Array.isArray(resultBookList)) {
            const html = await ViewController.buildAdminSite(resultBookList, numberOfPages, offsetNumber);
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

    public getRouter = () => {
        return this.ROUTER;
    }
}

export default AdminRouter;