const fs = require("fs");
const Movie = require("../Models/movieModel");
let movies = JSON.parse(fs.readFileSync("./data/movies.json"));
//middleware 1
// const checkId = (req, res, next, value) => {
//   console.log("movie ID is" + value);
//   const singleMovie = movies.find((ele) => ele.id === value * 1);
//   if (!singleMovie) {
//     return res.status(404).json({
//       status: "faild",
//       message: "Movie with id " + value + " is not found",
//     });
//   }
//   next();
// };
//middleware 2
const validateBody = (req, res, next) => {
  if (!req.body.name || !req.body.releseYear) {
    return res.status(404).json({
      status: "fails",
      message: "Not a valid file data",
    });
  }
  next();
};

// GET api- /movies
const getAllMovies = async (req, res) => {
  const excludeField = ['page','sort','limit','fields'];
  const queryObjet = {...req.query};
  excludeField.forEach((ele)=>{
    delete queryObjet[ele]
  })
  // console.log("queryObjet",queryObjet)
  try {
    let query = Movie.find(queryObjet);
    //SORTING LOGIC
    if(req.query.sort){
      const sortby = req.query.sort.split(',').join(' ');
      //(releseYear, price)
      query = query.sort(sortby)
    }else{
      query = query.sort('-createdAt')
    }

    //PAGINATION
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1 || 10;
    //page 1: 1 to 10 and page2: 11 to 20 and page 3: 21 to 30
    const skip = (page-1)*limit;
     query = query.skip(skip).limit(limit);
     if(req.query.page){
      const moviesCount = await Movie.countDocuments();
      if(skip >= moviesCount) {
        throw new Error("This page is not found!")
      }
     }
    const movies = await query;
    // const allMovie = await Movie.find()
    //   .where("duration")
    //   .equals(req.query.duration)
    //   .where("rating")
    //   .equals(req.query.rating);

    res.status(200).json({
      message: "Success",
      length: movies.length,
      data: {
        movies,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
  // res.status(200).json({
  //   status: "Success",
  //   count: movies.length,
  //   requestAt: req.requestAt,
  //   data: {
  //     movies: movies,
  //   },
  // });
};
const getAllMovieById = async (req, res) => {
  try {
    const id = req.params.id;
    // const getMovieById = await Movie.find({_id:id})
    const getMovieById = await Movie.findById(id);
    res.status(200).json({
      status: "Success",
      data: getMovieById,
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }

  // const id = req.params.id * 1;
  // const singleMovie = movies.find((ele) => ele.id === id);
  //   if (!singleMovie) {
  //     return res.status(404).json({
  //       status: "faild",
  //       message: "Movie with id " + id + " is not found",
  //     });
  //   }
  // res.status(200).json({
  //   status: "success",
  //   data: {
  //     movie: singleMovie,
  //   },
  // });
};
const insertMovie = async (req, res) => {
  // const movie = new Movie({
  //   name: req.body.name,
  //   description: req.body.description,
  //   duration: req.body.duration,
  //   rating: req.body.rating,
  // });
  // movie.save().then((doc)=>{
  //   res.status(201).json({
  //     message: "Successfully saved",
  //     data: doc
  //   }).catch((err)=> {
  //     res.status(405).json({
  //       status:"Not Success",
  //       error: err
  //     })
  //   })
  // })
  try {
    const movie1 = await Movie.create(req.body);
    res.status(201).json({
      status: "Success",
      data: {
        movie1,
      },
    });
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: error.message,
    });
  }
  // const newID = movies[movies.length - 1].id + 1;
  // const newMovie = Object.assign({ id: newID }, req.body);
  // movies.push(newMovie);
  // fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
  //   res.status(201).json({
  //     status: "success",
  //     data: {
  //       movie: newMovie,
  //     },
  //   });
  // });
  console.log(req.body);
  // res.send("Created")
};
const updateMovie = async (req, res) => {
  try {
    const updateMovie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log("updateMovie", updateMovie);
    res.status(200).json({
      status: "Success",
      data: {
        movie: updateMovie,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      message: error.message,
    });
  }
  // const id = req.params.id * 1;
  // const movieUpdate = movies.find((ele) => ele.id === id);
  //   if (!movieUpdate) {
  //     return res.status(404).json({
  //       status: "faild",
  //       message: "Movie with id " + id + " is not found",
  //     });
  //   }
  // const movieIndex = movies.indexOf(movieUpdate);
  // Object.assign(movieUpdate, req.body);
  // movies[movieIndex] = movieUpdate;
  // fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       movie: movieUpdate,
  //     },
  //   });
  // });
};
const deleteMovie = async (req, res) => {
  try {
    const deleteMovie = await Movie.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: "success",
      data: {
        movie: deleteMovie,
      },
    });
  } catch (error) {
    return res.status(404).json({
      status: "faild",
      message: error.message,
    });
  }
  // const id = req.params.id * 1;
  // const movieUpdate = movies.find((ele) => ele.id === id);
  //   if (!movieUpdate) {
  //     return res.status(404).json({
  //       status: "faild",
  //       message: "Movie with id " + id + " is not found",
  //     });
  //   }
  // const movieIndex = movies.indexOf(movieUpdate);
  // movies.splice(movieIndex, 1);
  // fs.writeFile("./data/movies.json", JSON.stringify(movies), (err) => {
  //   res.status(200).json({
  //     status: "success",
  //     data: {
  //       movie: null,
  //     },
  //   });
  // });
};

module.exports = {
  getAllMovies,
  getAllMovieById,
  insertMovie,
  updateMovie,
  deleteMovie,
  validateBody,
};
