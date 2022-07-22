const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookGenreSchema = new Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 100 },
});

bookGenreSchema.virtual('url').get(() => {
  return '/catalog/genre/' + this._id;
});

module.exports = mongoose.model('BookGenre', bookGenreSchema);
