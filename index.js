const { json } = require("body-parser");
const expres = require("express");
const morgan = require("morgan");
const movieRouter = require('./Routes/moviesRoute')
const app = expres();
const { request } = require("http");
const myCustomMiddleware = function (req, res, next) {
    console.log("custom middleware called");
    next();
}
app.use(expres.json());
if( process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}
app.use(expres.static('./public'));
app.use(myCustomMiddleware);
app.use((req, res, next)=> {
    req.requestAt = new Date().toISOString();
    next();
})
// USING ROUTES
app.use('/api/v1/movies',movieRouter)

module.exports = app
