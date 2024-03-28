type BookType = {
    title: string,
    year: number,
    isbn: string,
    pageNum: number,
    img: string,
    click: number,
    description: string
}

type BookFromDbType = BookType & {
    id: number
}

type AuthorType = {
    name: string,
    lastname: string
}

type BookAuthorType = BookType & AuthorType;

type AddBookToList = (list: BookType[]) => void;
type AddAuthorToList = (list: AuthorType[]) => void;


const BOOK_TITLES = [
    "СИ++ И КОМПЬЮТЕРНАЯ ГРАФИКА",
    "Программирование на языке Go!",
    "Толковый словарь сетевых терминов и аббревиатур",
    "Python for Data Analysis",
    "Thinking in Java 4th Edition",
    "Introduction to Algorithms",
    "JavaScript Pocket Reference",
    "Adaptive Code via C#: Class and Interface Design, Design Patterns, and SOLID Principle",
    "SQL: The Complete Referenc",
    "PHP and MySQL Web Development",
    "Статистический анализ и визуализация данных с помощью R",
    "Computer Coding for Kid",
    "Exploring Arduino: Tools and Techniques for Engineering Wizardry",
    "Программирование микроконтроллеров для начинающих и не только",
];

const AUTHOR_TITLES = [
    "Андрей Богуславский",
    "Марк Саммерфильд",
    "Мопс Вильямс",
    "Уэс Маккинни",
    "Брюс Эккель",
    "Томас Кормен",
    "Чарльз Лейзерсон",
    "Клиффорд Штайн",
    "Дэвид Флэнаган",
    "Гэри Маклин Холл",
    "Джеймс Роберт Грофф",
    "Люк Веллинг",
    "Сергей Мастицкий",
    "Джон Вудкок",
];

const IMAGES_NUMBER = [22, 23, 25, 26, 27, 29, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48];

function createRandomSentense(titles: string[], minLen: number, maxLen: number): string {
    const randomLen = Math.floor(Math.random() * (maxLen - minLen)) + minLen;
    let randGenWords: string[] = [];

    for (let i = 0; i < randomLen; i++) {
        const randIdx = Math.floor(Math.random() * (titles.length - 1));
        const title = titles[randIdx].split(" ");
        randGenWords.push(title[Math.floor(Math.random() * (title.length - 1))].toLowerCase());
    }
    return randGenWords.join(' ');
}

function createBookTitle(titles: string[], minTitleLen: number, maxTitleLen: number) {
    const title = createRandomSentense(titles, minTitleLen, maxTitleLen);
    return title.charAt(0).toUpperCase() + title.slice(1);
}

function createBook(list: BookType[]) {
    const imageIdx = Math.floor(Math.random() * (IMAGES_NUMBER.length - 1));
    list.push(
        {
            title: createBookTitle(BOOK_TITLES, 2, 10),
            year: Math.floor(Math.random() * (2023 - 1999)) + 1993,
            isbn: `ISBN${Math.floor(Math.random() * (8837519763 - 1233231221)) + 1233231221}`,
            pageNum: Math.floor(Math.random() * (1230 - 176)) + 176,
            img: `/images/books/${IMAGES_NUMBER[imageIdx]}.jpg`,
            description: "some description",
            click: 0
        }
    )
}

function createAuthor(list: AuthorType[]) {
    const author = createRandomSentense(AUTHOR_TITLES, 2, 4).split(" ");
    list.push(
        {
            name: author[0].charAt(0).toUpperCase() + author[0].slice(1),
            lastname: author[1].charAt(0).toUpperCase() + author[1].slice(1),
        }
    )
}

function createObject(booksNumber: number, callback: AddBookToList | AddAuthorToList): BookType[] | AuthorType[] {
    const list: BookType[] & AuthorType[] = [];

    for (let i = 0; i < booksNumber; i++) {
        callback(list);
    }

    return list;
}

function generateBooksAndAuthorsObjects(count: number) {
    const books = createObject(count, createBook);
    const author = createObject(count, createAuthor);

    return [books, author]
}

export { generateBooksAndAuthorsObjects, BookType, AuthorType, BookAuthorType, BookFromDbType };