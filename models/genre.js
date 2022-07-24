const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookGenreSchema = new Schema({
  name: { type: String, minLength: 3, maxLength: 100 },
});

bookGenreSchema.virtual('url').get(function () {
  return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model('BookGenre', bookGenreSchema);
