const Book = require('../models/Book');

class BookController {
  static home(request, h) {
    try {
      return h.response({ message: 'HomePage Book API' }).code(200);
    } catch (error) {
      return h.response(error).code(error.statusCode ?? 500);
    }
  }

  static async addBook(request, h) {
    try {
      const data = await Book.addBook(request);
      const { status } = data;
      let code;
      if (status === 'fail') code = 400;
      if (status === 'success') code = 201;
      return h.response(data).code(code);
    } catch (error) {
      return h.response(error).code(error.statusCode ?? 500);
    }
  }

  static async getBooks(request, h) {
    try {
      let dataBooks = await Book.getAllBooks(request);
      console.log(dataBooks);
      const { error } = dataBooks;
      if (error) throw error;
      // eslint-disable-next-line max-len
      dataBooks = dataBooks.map((book) => ({ id: book.id, name: book.name, publisher: book.publisher }));
      return h.response({
        status: 'success',
        data: {
          books: dataBooks,
        },
      }).code(200);
    } catch (error) {
      return h.response(error).code(error.statusCode ?? 500);
    }
  }

  static async getOneBook(request, h) {
    try {
      const book = await Book.getOneBook(request);
      const { status } = book;
      let code = 200;
      if (status === 'fail') code = 404;
      return h.response(book).code(code);
    } catch (error) {
      return h.response(error).code(error.statusCode ?? 500);
    }
  }

  static async updateBook(request, h) {
    try {
      const data = await Book.updateBook(request);
      const { status, code, message } = data;
      return h.response({ status, message }).code(code);
    } catch (error) {
      return h.response(error).code(error.statusCode ?? 500);
    }
  }

  static async deleteBook(request, h) {
    try {
      const data = await Book.deleteBook(request);
      const { status, code, message } = data;
      return h.response({ status, message }).code(code);
    } catch (error) {
      return h.response(error).code(error.statusCode ?? 500);
    }
  }
}

module.exports = BookController;
