var Author = require('../models/author');
const async = require('async');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');
const { format } = require('date-fns');

// Display list of all Authors.
exports.author_list = function (req, res, next) {
  Author.find()
    .sort([['family_name', 'ascending']])
    .exec(function (err, list_authors) {
      if (err) return next(err);
      res.render('author_list', {
        title: 'Author List',
        author_list: list_authors,
      });
    });
};
//The method uses the model's find(),sort() and exec() functions to return all Author objects sorted by family_name in alphabetic order. The callback passed to the exec() method is called with any errors(or null) as the first parameter, or a list of all authors on success. If there is an error it calls the next middleware function with the error value, and if not it renders the author_list(.ejs) template, passing the page title and the lsit of authors (author_list).

// Display detail page for a specific Author.
// Display detail page for a specific Author.
exports.author_detail = function (req, res, next) {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.params.id }, 'title summary').exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      } // Error in API usage.
      if (results.author == null) {
        // No results.
        var err = new Error('Author not found');
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render('author_detail', {
        title: 'Author Detail',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

//The method uses async.parallel() to query the Author and their associated book instances in apralles, with the callback rendering the page when (if) bother requests complete succesfully. The approach is exactly the same as described for the Genre detail page above.

// Display Author create form on GET.
exports.author_create_get = function (req, res) {
  res.render('author_form', { title: 'Create Author' });
};

// Handle Author create on POST.
exports.author_create_post = [
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name must be specified')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('date_of_birth', 'Invalid date of birth')
    .optional({
      checkFalsy: true,
    })
    .isISO8601()
    .toDate(),
  body('date_of_death', 'Invalid date of death')
    .optional({
      checkFalsy: true,
    })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    //Extract the validation errors from a request.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      //There are errors. Render the form again with sanitized values/errors messages.
      res.render('author_form', {
        title: 'Create Author',
        author: req.body,
        errors: errors.array(),
      });
      return;
    } else {
      //Data from form is valid
      //Create an Author object with escaped and trimmed data.
      let author = new Author({
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
      });
      author.save(function (err) {
        if (err) return next(err);
        //Succesfully saved - redirect to new author record
        res.redirect(author.url);
      });
    }
  },
];

//The structure and behavior of this code is almost exactly the same as for creating a Genre object.
//Note : Unlike with the Genre post handler, we do not check whether the Author ebject already exists before saving it. Arguably we should, though as it is now we have multiple authors with the same name.

//The validation code demonstates several new features:

//We can daisy chain validators, using WithMessage() to specify the error message to display if the previous validation method fails. This makes it very easy to provide specific error messages without lot of code duplication.

//We can use the optional() function torun a subsequent validation only if a field has been entered (this allows us to validate optional fields). For example, below we check that the optional date of birth is an ISO8601 - compliant date (the checkFalsy flag means that we'll accept either an empty string or null as an empty value)

//Parameters are received from the request as strings. We can use toDate() or tooBoolean() to cast these to the proper JS types as shown at the end of the validator chain above.

// Display Author delete form on GET.
// Display Author delete form on GET.
// Display Author delete form on GET.
exports.author_delete_get = function (req, res, next) {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.params.id).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.params.id }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.author == null) {
        // No results.
        res.redirect('/catalog/authors');
      }
      // Successful, so render.
      res.render('author_delete', {
        title: 'Delete Author',
        author: results.author,
        author_books: results.authors_books,
      });
    }
  );
};

//The controller gets the id of the Author instance to be deleted from the URL parameter (req.params.id). It uses the async.parallel() method to get the author record and all associated books in parallel. When both operations have completed it renders the author_delete.ejs view, passing variables for the title, author, and author_books.

// Handle Author delete on POST.
// Handle Author delete on POST.
exports.author_delete_post = function (req, res, next) {
  async.parallel(
    {
      author(callback) {
        Author.findById(req.body.authorid).exec(callback);
      },
      authors_books(callback) {
        Book.find({ author: req.body.authorid }).exec(callback);
      },
    },
    function (err, results) {
      if (err) {
        return next(err);
      }
      // Success
      if (results.authors_books.length > 0) {
        // Author has books. Render in same way as for GET route.
        res.render('author_delete', {
          title: 'Delete Author',
          author: results.author,
          author_books: results.authors_books,
        });
        return;
      } else {
        // Author has no books. Delete object and redirect to the list of authors.
        Author.findByIdAndRemove(req.body.authorid, function deleteAuthor(err) {
          if (err) {
            return next(err);
          }
          // Success - go to author list
          res.redirect('/catalog/authors');
        });
      }
    }
  );
};

//First we validate that an id has been provided( this is sent via the form body parameters, rather than using the version in the URL).Then we get the author and their associated books in the same way as for the GET route. If there are no books then we delete the author object and redirect to the list of all authors. If there are still books then we just rerender the form, passing in the author and list of books to be deleted.

//Note : We could check if the call to findById() returns any result, and if not, immediately render the list of all authors. We've left the code as it is above for brevity ( it will still return the list of authors if the id is not found, but this will happen after findByIdAndRemove)

// Display Author update form on GET.
exports.author_update_get = function (req, res, next) {
  //Get author information
  Author.findById(req.params.id).exec((err, author) => {
    if (err) return next(err);
    if (author == null) {
      //No results.
      let err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }
    //Sucess
    res.render('author_form', {
      title: 'Edit Author',
      author,
      formatDate: format,
    });
  });
};

// Handle Author update on POST.
exports.author_update_post = [
  //Validate and sanitize fields
  body('first_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('First name missing')
    .isAlphanumeric()
    .withMessage('First name contains non-alphanumeric characters'),

  body('family_name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Family name is missing')
    .isAlphanumeric()
    .withMessage('Family name contains non-alphanumeric characters'),

  body('date_of_birth', 'Invalid date of birth')
    .trim()
    .optional()
    .isISO8601()
    .toDate(),

  body('date_of_death', 'Invalid date of death')
    .trim()
    .optional()
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    //Extract the validation errors from request.
    const errors = validationResult(req);

    //Create an Authro object with sanitized data maintaining the old id

    let author = new Author({
      first_name: req.body.first_name,
      family_name: req.body.family_name,
      date_of_birth: req.body.date_of_birth,
      date_of_death: req.body.date_of_death,
      _id: req.params.id, //Keeping the id of the object as is or else a new id is to be assigned
    });

    if (!errors.isEmpty()) {
      //There are errors. Render the form again with sanitized values && error messages
      res.render('author_form', {
        title: 'Edit Author',
        author,
        formatDate: format,
        errors: errors.array(),
      });
      return;
    } else {
      Author.findByIdAndUpdate(
        req.params.id,
        author,
        {},
        function (err, theauthor) {
          if (err) return next(err);
          //Succesful - redirect to author detail page.
          res.redirect(theauthor.url);
        }
      );
    }
  },
];

//The module first requries the model that we'll later  be using to access and update our data. It then exports function for each of the URLs we wish to handle (the create, update and delete operations use forms, and hence also have additional methods for handling form post requests - we'll discuss those methods in the 'forms article' later on).

//All the functions have the standard form of an Express middleware function, with arguments for the request and response. We could also include the next function to be called if the method does not complete the request cycle, but in al lthese cases it does, so we've omitted it. The methods return a string indicating that the associated page has not yet been created. If a controller function is exprected to receive path parameters, these are output in the message string ( see req.params.id above)
