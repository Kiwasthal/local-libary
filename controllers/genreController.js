const Book = require('../models/book');
const Genre = require('../models/genre');

const async = require('async');
const { body, validationResult } = require('express-validator');

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
exports.genre_create_get = function (req, res) {
  res.render('genre_form', {
    title: 'Create Genre',
  });
};
//The method uses async.parallel() to query the genre name and its associated books in parallel, with the callback rendering the page when (if) both requests complete successfully.

//The ID of the required genre record is encoded at the end of the URL and extracted automatically based on the route definition (/genre/:id). The ID is accessed within the controller vai the request parameters : req.params.id. It us used in Genre.findById() to get the current genre. It is also used to get all Book objects that have the genre ID in their genre field : Book.find({ 'genre' : req.params.id})

// Handle Genre create on POST.
// Handle Genre create on POST.
exports.genre_create_post = [
  // Validate and sanitize the name field.
  body('name', 'Genre name required').trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', {
        title: 'Create Genre',
        genre: genre,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ name: req.body.name }).exec(function (err, found_genre) {
        if (err) {
          return next(err);
        }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save(function (err) {
            if (err) {
              return next(err);
            }
            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  },
];

//Vaalidate and sanitize the name field.
//The first thing to note is that instead of being a single middleware fn (with args(req,res,next)) the controller specifies an array of middleware functions. The array is passed to the router function and each method is called in order.

//Note : This approach is needed, because the validators are middleware functions.

//The first method in the array defines a body validator (body()) that validates and sanitized the field. This uses trim() to remove any traling/leading whitespace, checks that the name field is not empty, and then uses escape() to remove any dangerous HTML characters.

//After specifying the validators we create a middleware function to extract any validation errors. We use isEmpty() to echeck whether there are any errors in the validation result. If there are then we render the form again, passing in our sanitized genre object and the array of the error messages (errors.array())

//If the genre name data is valid then we check if a Genre with the same name already exists (as we don't want to ccreate duplicates). If it does, we redirect to the existing genre's detail page. If not, we save the new Genre and redirect to it's detail page.

//This same pattern is used in all our post controllers : we run validators (with sanitizers),  then check for errors and either re-render the form with error information ro save the data.

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
