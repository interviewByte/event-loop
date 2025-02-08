const mongoose = require("mongoose");
const fs = require("fs");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Movie = require("../Models/movieModel");

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Successfully Connected to database");
  })
  .catch((err) => {
    console.log("Something is wrong to connecting the mongo DB database ", err);
  });

//READ MOVIES.JSON FILE
// it reurn json data in the form of string (we need to convert string json data into javascript object(use JSON.parse()))
const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf8"));

// DELETE EXISTING MOVIE DOCUMNENT FROM OUR MOVIE COLLECTION
const deleteMovies = async () => {
  try {
    await Movie.deleteMany();
    console.log("Data Successfully Deleted");
  } catch (error) {
    console.log("Error has occured in delete", error.message);
  }
  process.exit();
};

// IMPORT MOVIE DATA TO MONGODB COLLECTION
const importMovies = async () => {
  try {
    await Movie.create(movies);
    console.log("Data Successfully !imported");
  } catch (error) {
    console.log("Error has occured in imported", error.message);
  }
  process.exit();
};

if(process.argv[2] === '--delete') {
    deleteMovies();
}
if(process.argv[2] === '--import') {
    importMovies();
}
