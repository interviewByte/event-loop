const expres = require("express");
const router = expres.Router();
const authController = require("../Controllers/authController")
const {
  getAllMovies,
  getAllMovieById,
  insertMovie,
  updateMovie,
  deleteMovie,
  checkId,
  validateBody,
} = require("../Controllers/moviesController");

// router.param("id", checkId);
router.route("/").get(authController.protect,getAllMovies).post( insertMovie);
router
  .route("/:id")
  .get(authController.protect, getAllMovieById)
  .patch(updateMovie)
  .delete(authController.protect, authController.restrict('admin'), deleteMovie);
module.exports = router;
