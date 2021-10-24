// server.js

// set up ======================================================================
// get all the tools we need
var express = require("express"); //requiring express to build out APi //declaring express and setting value to function require with passed argument of express
var app = express(); //declaring a variable that references the method express.
var port = process.env.PORT || 8080; //look for port envirnoment varible if not, use 8080 //declaring port variable and setting value to read port in env or go to 8080
const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose"); //declaring mongoose and setting value to function require with passed argument of mongoose dependency (It is like a an Object Relational Mapper (ORM). It helps us to enforce a specific schema )
var passport = require("passport"); //use to authinticate////declaring passport and setting value to require passport dependency (for authentication)
var flash = require("connect-flash"); //declaring flash and setting value to require connect-flash dependency

var morgan = require("morgan"); //logger, log everything that is happening on server //declaring morgan and setting value to requiring morgan dependency (loga http request and error messages)
var cookieParser = require("cookie-parser"); //declaring cookieParser and setting value to requiring cookie-parser dependency (populates req.cookies with object keyed by cookie names)
var bodyParser = require("body-parser"); //look at elements that are coming across with request//not commonly used anymore, used to parse...body of code?? idkkk man. deprecated
var session = require("express-session"); // keep an opened session //declaring session and setting value to requiring express-session dependency (store session serverside)

var configDB = require("./config/database.js"); //(declaring configDB and setting value to requiring ./config/database.js dependency (loading configuration))
//everything has to be 'let', not 'const'.

var db;

// configuration ===============================================================
mongoose.connect(configDB.url, (err, database) => {
  //mongoose method to connect to database
  if (err) return console.log(err);
  db = database;
  require("./app/routes.js")(app, passport, db); //<- grab function and call function
}); // connect to our database

require("./config/passport")(passport); //calling a function // pass passport (authentication) for configuration

//MIDDLEWARES: set up our express application
app.use(morgan("dev")); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs"); // set up ejs for templating

// required for passport
app.use(
  session({
    secret: "rcbootcamp2021b", // session secret
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// launch ======================================================================
app.listen(port);
console.log("The magic happens on port " + port);
