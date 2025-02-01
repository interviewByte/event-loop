const expres = require("express");
const router = expres.Router();
const {
  getAllMovies,
  getAllMovieById,
  insertMovie,
  updateMovie,
  deleteMovie,
  checkId,
  validateBody,
} = require("../Controllers/moviesController");

router.param("id", checkId);
router.route("/").get(getAllMovies).post(validateBody, insertMovie);
router
  .route("/:id")
  .get(getAllMovieById)
  .patch(updateMovie)
  .delete(deleteMovie);
module.exports = router;
