const fs = require("fs");
let movies = JSON.parse(fs.readFileSync("./data/movies.json"));
//middleware 1
const checkId = (req, res, next, value) => {
    console.log('movie ID is' + value);
    const singleMovie = movies.find((ele) => ele.id === value*1);
    if (!singleMovie) {
      return res.status(404).json({
        status: "faild",
        message: "Movie with id " + value + " is not found",
      });
    }
    next()
  }
  //middleware 2
  const validateBody = (req, res, next) => {
    if( !req.body.name || !req.body.releseYear) {
        return res.status(404).json({
            status: 'fails',
            message: 'Not a valid file data'
        })
    }
    next();
  }

// GET api- /movies
const getAllMovies = (req, res) => {
  res.status(200).json({
    status: "Success",
    count: movies.length,
    requestAt: req.requestAt,
    data: {
      movies: movies,
    },
  });
};
const getAllMovieById = (req, res) => {
  const id = req.params.id * 1;
  const singleMovie = movies.find((ele) => ele.id === id);
//   if (!singleMovie) {
//     return res.status(404).json({
//       status: "faild",
//       message: "Movie with id " + id + " is not found",
//     });
//   }
  res.status(200).json({
    status: "success",
    data: {
      movie: singleMovie,
    },
  });
};
const insertMovie = (req, res) => {
  const newID = movies[movies.length - 1].id + 1;
  const newMovie = Object.assign({ id: newID }, req.body);
  movies.push(newMovie);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(201).json({
      status: "success",
      data: {
        movie: newMovie,
      },
    });
  });
  console.log(req.body);
  // res.send("Created")
};
const updateMovie = (req, res) => {
  const id = req.params.id * 1;
  const movieUpdate = movies.find((ele) => ele.id === id);
//   if (!movieUpdate) {
//     return res.status(404).json({
//       status: "faild",
//       message: "Movie with id " + id + " is not found",
//     });
//   }
  const movieIndex = movies.indexOf(movieUpdate);
  Object.assign(movieUpdate, req.body);
  movies[movieIndex] = movieUpdate;
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        movie: movieUpdate,
      },
    });
  });
};
const deleteMovie = (req, res) => {
  const id = req.params.id * 1;
  const movieUpdate = movies.find((ele) => ele.id === id);
//   if (!movieUpdate) {
//     return res.status(404).json({
//       status: "faild",
//       message: "Movie with id " + id + " is not found",
//     });
//   }
  const movieIndex = movies.indexOf(movieUpdate);
  movies.splice(movieIndex, 1);
  fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
    res.status(200).json({
      status: "success",
      data: {
        movie: null,
      },
    });
  });
};

module.exports = {getAllMovies, getAllMovieById, insertMovie, updateMovie, deleteMovie,checkId,validateBody}

