const Author = require('../models/author');

//Display list of all Authros.

exports.author_list = (req, res) => {
  res.send('Not IMPLEMENTED  : Author list');
};

//Display detail page for a specific Author.

exports.author_detail = (req, res) => {
  res.send('NOT IMPLEMENTED : Author detail: ' + req.params.id);
};

//Display Author create form on GET.

exports.author_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED : Author create GET');
};

//Handle Author create on POST.

exports.author_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED : Author create POST');
};

//Display Author delete form on GET.
exports.author_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED : Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: Author update GET');
};

//Handle Author update on POST
exports.author_upadte_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Authro update POST');
};

//The module first requries the model that we'll later  be using to access and update our data. It then exports function for each of the URLs we wish to handle (the create, update and delete operations use forms, and hence also have additional methods for handling form post requests - we'll discuss those methods in the 'forms article' later on).

//All the functions have the standard form of an Express middleware function, with arguments for the request and response. We could also include the next function to be called if the method does not complete the request cycle, but in al lthese cases it does, so we've omitted it. The methods return a string indicating that the associated page has not yet been created. If a controller function is exprected to receive path parameters, these are output in the message string ( see req.params.id above)
