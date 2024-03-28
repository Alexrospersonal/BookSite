import { Book } from "./dbController.js";
import { ADMIN_URI, BASE_PATH } from '../settings.js';
import { getHtmlFromFile, validateBookFromDbType } from "../utils/generic.js";


export const HEADER = await getHtmlFromFile('html\\books-header.html');
export const FOOTER = await getHtmlFromFile('html\\books-footer.html');

export function createHTMLBookContainer(book: Book) {
    return `
    <div id="book-container" book-id="${book.id}">
        <div id="bookImg" class="col-xs-12 col-sm-3 col-md-3 item" style="margin:0px;">
            <img src="${book.img}" alt="${book.title}" class="img-responsive">
            <hr>
        </div>
        <div class="col-xs-12 col-sm-9 col-md-9 col-lg-9 info">
            <div class="bookInfo col-md-12">
                <div id="title" class="titleBook">${book.title}</div>
            </div>
            <div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <div class="bookLastInfo">
                    <div class="bookRow"><span class="properties">автор:</span><span id="author">
                    ${book.authors.join(', ')}
                    </span></div>
                    <div class="bookRow"><span class="properties">год:</span><span id="year">${book.year}</span>
                    </div>
                    <div class="bookRow"><span class="properties">страниц:</span><span id="pages">${book.page_num}</span>
                    </div>
                    <div class="bookRow"><span class="properties">isbn:</span><span id="isbn">${book.isbn}</span></div>
                </div>
            </div>
            <div class="btnBlock col-xs-12 col-sm-12 col-md-12">
                <button type="button" class="btnBookID btn-lg btn btn-success">Хочу читать!</button>
            </div>
            <div class="bookDescription col-xs-12 col-sm-12 col-md-12 hidden-xs hidden-sm">
                <h4>О книге</h4>
                <hr>
                <p id="description">${book.description}</p>
            </div>
        </div>
        <div class="bookDescription col-xs-12 col-sm-12 col-md-12 hidden-md hidden-lg">
            <h4>О книге</h4>
            <hr>
            <p class="description">${book.description}</p>
        </div>
    </div>        
    `;
}

export function createHTMLAdminBookList(list: Book[]): string[] {
    const listOfTr: string[] = [];

    for (const book of list) {
        if (validateBookFromDbType(book)) {
            const td = `
            <tr book_id="${book.id}">
                <td><img src="${book.img}" alt="" srcset=""></td>
                <td>${book.title}</td>
                <td>${book.authors.join(', ')}</td>
                <td>${book.year}</td>
                <td><a href="${BASE_PATH}${ADMIN_URI}?delete=${book.id}">Видалити</a></td>
                <td>${book.click}</td>
                </tr>
            `;
            listOfTr.push(td);
        }
    }

    return listOfTr;

}

export function createHTMLMainPageBookList(list: Book[]): string[] {
    const listOfTr: string[] = [];

    for (const book of list) {
        if (validateBookFromDbType(book)) {
            const td = `
            <div data-book-id="${book.id}" class="book_item col-xs-6 col-sm-3 col-md-2 col-lg-2">
                <div class="book">
                    <a href="http://localhost:3000/books/book/${book.id}"><img src="${book.img}"
                            alt="${book.title}">
                        <div data-title="${book.title}" class="blockI" style="height: 46px;">
                            <div data-book-title="${book.title}" class="title size_text">${book.title}</div>
                            <div data-book-author="${book.authors.join(', ')}" class="author">${book.authors.join(', ')}</div>
                        </div>
                    </a>
                    <a href="http://localhost:3000/books/book/${book.id}">
                        <button type="button" class="details-btn">Читать</button>
                    </a>
                </div>
            </div>
            `;
            listOfTr.push(td);
        }
    }

    return listOfTr;
}

export function createHTMLpagination(currPage: number, maxPage: number, basePath: string): string[] {
    const listOfLis: string[] = [];

    const prevPageHref = `${basePath}?offset=${currPage - 1}"`;
    const curPageHref = `${basePath}?offset=${currPage}"`;
    const nextPageHref = `${basePath}?offset=${currPage + 1}"`;

    if (currPage != 1) {
        listOfLis.push(`
            <li class="page-item">
                <a class="page-link" ${prevPageHref} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                </a>
            </li>
        `);
        listOfLis.push(`<li class="page-item"><a class="page-link" ${prevPageHref}>${currPage - 1}</a></li>`);
    }

    listOfLis.push(`<li class="page-item active"><a class="page-link" ${curPageHref}>${currPage}</a></li>`);

    if (currPage != maxPage) {
        listOfLis.push(`<li class="page-item"><a class="page-link" ${nextPageHref}>${currPage + 1}</a></li>`);
        listOfLis.push(`
            <li class="page-item">
                <a class="page-link" ${nextPageHref} aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                </a>
            </li>
        `);
    }

    return listOfLis;
}

