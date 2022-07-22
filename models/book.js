const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BooksSchema = new Schema({
  title: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Author', required: true },
  summary: { tyep: String, required: true },
  isbn: { type: String, required: true },
  genre: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
});

//Virtual for book's URL

BooksSchema.virtual('url').get(() => {
  return '/catalog/book/' + this._id;
});

module.exports = mongoose.model('Book', BooksSchema);
