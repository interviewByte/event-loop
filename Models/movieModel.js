const mongoose = require("mongoose")
const MoviesSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required field'],
    unique: true
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: [true, 'Duration is required field'],
  },
  rating: {
    type: Number,
    default: 1.0
  },
});
// Creating Model (Movie model/ model name must be start with capital letter)
const Movie = mongoose.model("Movie", MoviesSchema);
module.exports = Movie;
