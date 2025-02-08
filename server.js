const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./index');
const mongoose = require("mongoose")


// console.log(app.get('env'))
const port = process.env.PORT || 8100;
// connect to MONGO DB
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Successfully Connected to database");
  })
  .catch((err) => {
    console.log("Something is wrong to connecting the mongo DB database ", err);
  });
app.listen(port, (err) => {
    if (err) {
      console.log("Error in running server");
      return;
    }
    console.log("Server is running on port", port);
  });