const Book = require('../models/book');
const Genre = require('../models/genre');

const async = require('async');

// Display list of all Genre.
exports.genre_list = function (req, res, next) {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec(function (err, list_genre) {
      if (err) return next(err);
      res.render('genre_list', {
        title: 'Genre List',
        genre_list: list_genre,
      });
    });
};

// Display detail page for a specific Genre.
exports.genre_detail = function (req, res, next) {
  async.parallel(
    {
      genre(callback) {
        Genre.findById(req.params.id).exec(callback);
      },
      genre_books(callback) {
        Book.find({ genre: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) return next(err);
      if (results.genre == null) {
        //if no results
        let err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }
      //Success! proceed to render
      res.render('genre_detail', {
        title: 'Genre Detail',
        genre: results.genre,
        genre_books: results.genre_books,
      });
    }
  );
};

// Display Genre create form on GET.
exports.genre_create_get = function (req, res) {};
//The method uses async.parallel() to query the genre name and its associated books in parallel, with the callback rendering the page when (if) both requests complete successfully.

//The ID of the required genre record is encoded at the end of the URL and extracted automatically based on the route definition (/genre/:id). The ID is accessed within the controller vai the request parameters : req.params.id. It us used in Genre.findById() to get the current genre. It is also used to get all Book objects that have the genre ID in their genre field : Book.find({ 'genre' : req.params.id})

// Handle Genre create on POST.
exports.genre_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre create POST');
};

// Display Genre delete form on GET.
exports.genre_delete_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete GET');
};

// Handle Genre delete on POST.
exports.genre_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre delete POST');
};

// Display Genre update form on GET.
exports.genre_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update GET');
};

// Handle Genre update on POST.
exports.genre_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Genre update POST');
};
