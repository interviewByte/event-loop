const mongoose = require("mongoose")
const MoviesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required field'],
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required field'],
    trim: true
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required field'],
  },
  rating: {
    type: Number,
  },
  totalRating: {
    type: Number,
  },
  releseYear: {
    type: Number,
    required: [true, 'releseYear is required field'],
  },
  releseDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  genres: {
    type: [String],
    required: [true, 'Genres is required field'],
  },
  directors: {
    type: [String],
    required: [true, 'Directors is required field'],
  },
  coverImage: {
    type: String,
    required: [true, 'Cover Image is required field'],
  },
  actors: {
    type: [String],
    required: [true, 'Actors is required field'],
  },
  price: {
    type: Number,
    required: [true, 'Price is required field'],
  }
});
// Creating Model (Movie model/ model name must be start with capital letter)
const Movie = mongoose.model("Movie", MoviesSchema);
module.exports = Movie;
