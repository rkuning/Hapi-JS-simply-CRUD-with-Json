const BookController = require('../controllers/BookController');

const routes = [
  {
    path: '/',
    method: 'GET',
    handler: BookController.home,
  },
  {
    path: '/books',
    method: 'POST',
    handler: BookController.addBook,
  },
  {
    path: '/books',
    method: 'GET',
    handler: BookController.getBooks,
  },
  {
    path: '/books/{id}',
    method: 'GET',
    handler: BookController.getOneBook,
  },
  {
    path: '/books/{id}',
    method: 'PUT',
    handler: BookController.updateBook,
  },
  {
    path: '/books/{id}',
    method: 'DELETE',
    handler: BookController.deleteBook,
  },
];

module.exports = routes;
