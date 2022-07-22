const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BooksSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { type: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

//Virtual for book's URL

BooksSchema.virtual('url').get(() => {
  return '/catalog/book/' + this._id;
});

module.exports = mongoose.model('Book', BooksSchema);

//The main difference here is that we've created two references to other models

//Author is a reference to a single Author model object, and is requries

//Genre is a reference to an array of Genre model objects. We haven't declared this object yet!
