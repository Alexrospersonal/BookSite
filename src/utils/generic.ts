import { Router } from "express";
import fs from 'fs/promises';
import { Book } from "../controllers/dbController.js";
import path from "path";
import { STATIC } from "../settings.js";

interface BaseRouter {
    getRouter: () => Router;
}

export async function readFileAsString(filePath: string) {
    try {
        const data = await fs.readFile(filePath, { encoding: 'utf8' });
        return data;
    } catch (err) {
        throw new Error("File not reading");
    }
}

export function validateBookFromDbType(book: object): book is Book {
    return 'title' in book;
}

export async function getHtmlFromFile(f: string) {
    return await readFileAsString(
        path.resolve(
            path.join(STATIC, f)
        )
    );
}



export default BaseRouter;