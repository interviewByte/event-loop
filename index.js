const { json } = require("body-parser");
const expres = require("express");
const morgan = require("morgan");
const movieRouter = require("./Routes/moviesRoute");
const app = expres();
const { request } = require("http");
const { type } = require("os");
const myCustomMiddleware = function (req, res, next) {
  console.log("custom middleware called");
  next();
};
app.use(expres.json());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}


// const Cat = mongoose.model("Cat", { name: String });
// Creating Schema
// here craeting a documnent using Movie Model
// const testMovie = new Movie({
//     name: "Welcome back 2",
//     description: "It is a kind of Comedy movie Part 2",
//     duration: 130,
//     rating: 4.6
// })
// now save this document into database
// save method will create a new documnent in the database with above movie model value
// so in database first of all a Movie collection will be created and in the movies collection
// below documnent will be saved, keep in mind save method is going to return a promoise it retun newly created documnent which has been saved in the database
// testMovie.save().then((doc)=>{
//     console.log("doc:",doc) 
// }).catch((err)=> {
//     console.log("Error occured",err)
// })

// const kitty = new Cat({ name: "Zildjian" });
// kitty.save().then(() => console.log("meow"));
app.use(expres.static("./public"));
app.use(myCustomMiddleware);
app.use((req, res, next) => {
  req.requestAt = new Date().toISOString();
  next();
});
// USING ROUTES
app.use("/api/v1/movies", movieRouter);

module.exports = app;
