import path from 'path';
import { Book } from './dbController.js';
import { createHTMLAdminBookList, createHTMLMainPageBookList, createHTMLBookContainer, createHTMLpagination, HEADER, FOOTER } from './htmlTemplates.js';
import { readFileAsString } from '../utils/generic.js';
import { ADMIN_URI, BASE_PATH } from '../settings.js';


class ViewController {

    public static async buildAdminSite(list: Book[], maxPage: number, curPage: number) {
        const bookList = createHTMLAdminBookList(list);

        const pagination = createHTMLpagination(curPage, maxPage, `href="${BASE_PATH}${ADMIN_URI}`);

        const htmlPath = path.join('src\\static\\', 'html\\adminPanel.html');
        let html = await readFileAsString(path.resolve(htmlPath));

        return ViewController.joinHtml({
            book_list: bookList.join(' '),
            pagination: pagination.join(' '),
        }, html);
    }

    public static async buildMainSitePage(list: Book[], maxPage: number, curPage: number) {
        const bookList = createHTMLMainPageBookList(list);

        const pagination = createHTMLpagination(curPage, maxPage, `href="${BASE_PATH}/books/`);

        const htmlPath = path.join('src\\static\\', 'html\\books-page.html');
        let html = await readFileAsString(path.resolve(htmlPath));

        return ViewController.joinHtml({
            book_list: bookList.join(' '),
            pagination: pagination.join(' '),
            header: HEADER,
            footer: FOOTER
        }, html);
    }


    public static buildBookPage = async (book: Book) => {
        const htmlPath = path.join('src\\static\\', 'html\\book-page.html');
        const bookStr = createHTMLBookContainer(book);

        let html = await readFileAsString(path.resolve(htmlPath));

        return ViewController.joinHtml({
            book: bookStr,
            header: HEADER,
            footer: FOOTER
        }, html);
    }

    private static joinHtml(obj: { [key: string]: string }, html: string): string {
        for (const key in obj) {
            const element = obj[key];
            html = html.replace(`{{${key}}}`, element);
        }
        return html;
    }
}


export default ViewController;