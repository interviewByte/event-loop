const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./index');

// console.log(app.get('env'))
const port = process.env.PORT || 8100;
app.listen(port, (err) => {
    if (err) {
      console.log("Error in running server");
      return;
    }
    console.log("Server is running on port", port);
  });