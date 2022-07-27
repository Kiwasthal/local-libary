const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');
const { body, validationResult } = require('express-validator');

//Display list of all BookInstances
exports.bookinstance_list = (req, res, next) => {
  BookInstance.find()
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) return next(err);
      res.render('bookinstance_list', {
        title: 'Book Instance List',
        bookinstance_list: list_bookinstances,
      });
    });
};

//Display detail page for a specific BookInstance.
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec(function (err, bookinstance) {
      if (err) return next(err);
      if (bookinstance == null) {
        //No results
        let err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      //Successful proceed to render
      res.render('bookinstance_detail', {
        title: `Copy : ${bookinstance.book.title} `,
        bookinstance,
      });
    });
};
//The moethod calls BookInstance.findById() with the ID of a specific book instance extracted from the URL (using the route), and accessed within the controller via the request parameters : req.params.id. It then calls populate() to get the details of the associated Book.

//Display BookInstance create form on GET.
exports.bookinstance_create_get = (req, res) => {
  Book.find({}, 'title').exec((err, books) => {
    res.render('bookinstance_form', {
      title: 'Create BookInstance',
      book_list: books,
    });
  });
};
//The controller gets a list of all books and passes it to the view bookinstance_form.ejs

//Handle BookInstance create on POST.
exports.bookinstance_create_post = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('due_back', 'Invalid date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),

  (req, res, next) => {
    //Extract the validation errors from request
    const errors = validationResult(req);

    //Create a BookInstance object with escaped and trimmed data.
    let bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
    });

    if (!errors.isEmpty()) {
      //Since there are errors. Rerender the form with sanitized values and error messages
      Book.find({}, 'title').exec((err, books) => {
        if (err) next(err);
        //Succesful, proceed to rendering
        res.render('bookinstance_form', {
          title: 'Create BookInstance',
          book_list: books,
          selected_book: bookinstance.book._id,
          errors: errors.array(),
          bookinstance,
        });
      });
      return;
    } else {
      //Our data from the form is valid.
      bookinstance.save(err => {
        if (err) return next(err);
        //Success! redirect to new bookinstance record
        res.redirect(bookinstance.url);
      });
    }
  },
];
//Same structure as other forms. First we validate && sanitize our data. If the data is invalid, we then re-display the form along with the data originally entered by the user plus a list of errors (error.array()). If the data is valid, we save the new BookInstance record and direct the user to the valid page.

//Note :We could also add an extra parameter for validation only if the status if available and the due_date is empty in case we don't want available books with due_date since it does not make logical sense.

// Display BookInstance delete form on GET.
exports.bookinstance_delete_get = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) return next(err);
      if (bookinstance == null) {
        //No results redirect to bookinstance list
        res.redirect('/catalog/bookinstances');
      }
      //Success , proceed to render.
      res.render('bookinstance_delete', {
        title: 'Delete Copy',
        bookinstance,
      });
    });
};

// Handle BookInstance delete on POST.
exports.bookinstance_delete_post = function (req, res, next) {
  BookInstance.findByIdAndRemove(req.body.bookinstanceid, err => {
    if (err) return next(err);
    //Success redirect to bookinstance list
    res.redirect('/catalog/bookinstances');
  });
};

//Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

//Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED : BookInstance update POST');
};
