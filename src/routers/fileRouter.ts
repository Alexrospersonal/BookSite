import { Router, Request, Response } from "express";
import path from "path";
import BaseRouter from "../utils/generic.js";

class FileRouter implements BaseRouter {

    private readonly CSS_PATH = 'src\\static\\css';
    private readonly JS_PATH = 'src\\static\\js';
    private readonly IMAGES_PATH = 'src\\static\\images';
    private readonly ROUTER = Router();

    public constructor() {
        this.ROUTER.get('/css/:filename', this.getHandler(this.CSS_PATH));
        this.ROUTER.get('/js/:filename', this.getHandler(this.JS_PATH));
        this.ROUTER.get('/images/:filename', this.getHandler(this.IMAGES_PATH));
        this.ROUTER.get('/images/:dir/:filename', this.getHandler(this.IMAGES_PATH));
    }

    private getHandler = (path: string) => {
        return (req: Request, res: Response) => {
            if ('dir' in req.params) {
                const filename = `${req.params.dir}/${req.params.filename}`;
                res.sendFile(this.getFile(path, filename));
            } else {
                res.sendFile(this.getFile(path, req.params.filename));
            }
        }
    }

    private getFile = (filePath: string, filename: string) => {
        return path.resolve(path.join(filePath, filename));
    }

    public getRouter = () => {
        return this.ROUTER;
    }
}

export default FileRouter;
