/* eslint-disable no-throw-literal */
/* eslint-disable no-param-reassign */
const fs = require('fs');
const util = require('util');
const path = require('path');
const { nanoid } = require('nanoid');

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

class Book {
  constructor(
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  ) {
    this.id = id;
    this.name = name;
    this.year = year;
    this.author = author;
    this.summary = summary;
    this.publisher = publisher;
    this.pageCount = pageCount;
    this.readPage = readPage;
    this.finished = finished;
    this.reading = reading;
    this.insertedAt = insertedAt;
    this.updatedAt = updatedAt;
  }

  static async saveBook(book) {
    try {
      await writeFile(path.join(__dirname, '../data/books.json'), JSON.stringify(book, null, 2), 'utf8');
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  static async getBooks() {
    try {
      let books = await readFile(path.join(__dirname, '../data/books.json'), 'utf8');
      books = JSON.parse(books).map((book) => {
        // eslint-disable-next-line max-len
        const {
          // eslint-disable-next-line max-len
          id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
        } = book;
        // eslint-disable-next-line max-len
        return new Book(id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt);
      });
      return books;
    } catch (error) {
      // eslint-disable-next-line no-console
      return error;
    }
  }

  static async getAllBooks(request) {
    try {
      const { query } = request;
      let books = await this.getBooks();
      if (Object.keys(query).length !== 0) {
        const q = Object.keys(query);
        const check = ['reading', 'finished', 'name'];
        const valQuery = check.find((qp) => qp === q[0]);
        if (!valQuery) throw { error: 'Query unknown!' };
        if (q.length > 1) throw { error: 'Only allow 1 query!' };
        // eslint-disable-next-line array-callback-return, consistent-return
        if (q[0] === 'reading') books = books.filter((book) => ((parseInt(query.reading, 10)) ? book.reading === true : book.reading === false));
        if (q[0] === 'finished') books = books.filter((book) => ((parseInt(query.finished, 10)) ? book.finished === true : book.finished === false));
        // // perbaikan besuk
        if (q[0] === 'name') books = books.filter((book) => book.name.includes(query.name));
      }
      return books;
    } catch (error) {
      return { error };
    }
  }

  static async addBook(request) {
    try {
      const id = nanoid(16);
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
      } = request.payload;
      const finished = pageCount === readPage;
      // const reading = !!((readPage > 0 && readPage <= pageCount));
      const insertedAt = new Date().toISOString();
      const updatedAt = insertedAt;

      if (name === undefined) {
        return {
          status: 'fail',
          message: 'Gagal menambahkan buku. Mohon isi nama buku',
        };
      }

      if (readPage > pageCount) {
        return {
          status: 'fail',
          message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        };
      }
      const books = await this.getBooks(request);
      // eslint-disable-next-line max-len
      const bookClass = new Book(id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt);
      books.push(bookClass);
      await this.saveBook(books);
      return {
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Buku gagal ditambahkan',
      };
    }
  }

  static async getOneBook(request) {
    try {
      const { id } = request.params;
      const books = await this.getBooks(request);
      // eslint-disable-next-line no-shadow
      const data = books.find((book) => book.id === id);
      if (!data) {
        return {
          status: 'fail',
          message: 'Buku tidak ditemukan',
        };
      }
      return {
        status: 'success',
        data: {
          book: data,
        },
      };
    } catch (error) {
      return error;
    }
  }

  static async updateBook(request) {
    try {
      const { id } = request.params;
      const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
      } = request.payload;
      const finished = pageCount === readPage;
      // const reading = !!((readPage > 0 && readPage <= pageCount));
      const updatedAt = new Date().toISOString();

      if (name === undefined) {
        return {
          status: 'fail',
          code: 400,
          message: 'Gagal memperbarui buku. Mohon isi nama buku',
        };
      }

      if (readPage > pageCount) {
        return {
          status: 'fail',
          code: 400,
          message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        };
      }

      let books = await this.getBooks(request);
      const data = books.find((book) => book.id === id);
      if (!data) {
        return {
          status: 'fail',
          code: 404,
          message: 'Gagal memperbarui buku. Id tidak ditemukan',
        };
      }

      books = books.map((book) => {
        if (id === book.id) {
          book.name = name;
          book.year = year;
          book.author = author;
          book.summary = summary;
          book.publisher = publisher;
          book.pageCount = pageCount;
          book.readPage = readPage;
          book.finished = finished;
          book.reading = reading;
          book.updatedAt = updatedAt;
        }
        return book;
      });
      await this.saveBook(books);
      return {
        status: 'success',
        code: 200,
        message: 'Buku berhasil diperbarui',
      };
    } catch (error) {
      return error;
    }
  }

  static async deleteBook(request) {
    try {
      const { id } = request.params;
      let books = await this.getBooks(request);
      const data = books.find((book) => book.id === id);
      if (!data) {
        return {
          status: 'fail',
          code: 404,
          message: 'Buku gagal dihapus. Id tidak ditemukan',
        };
      }
      books = books.filter((book) => book.id !== id);
      await this.saveBook(books);
      return {
        status: 'success',
        code: 200,
        message: 'Buku berhasil dihapus',
      };
    } catch (error) {
      return error;
    }
  }
}

module.exports = Book;
