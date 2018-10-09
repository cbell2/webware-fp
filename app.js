const express = require('express');
const hbs = require("express-handlebars");
var path = require('path');
var loginRoute = require('./routes/loginRoute');
var mainRoute = require('./routes/mainRoute');
var createEventRoute = require('./routes/createEventRoute');
var loginFormRoute = require('./routes/loginFormRoute');
var bodyParser = require('body-parser');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var mongSetup = require('./mongooseSetup');
var db = mongSetup.db;


var app = express();


app.engine( 'hbs', hbs( {
    helpers: {
        // getUsername: function(){
        //     return someUsername;
        // }

    },
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts/',
    partialsDir: __dirname + '/views/partials/'
} ) );

app.set('view engine', 'hbs');

app.use((req, res, next) =>{
    // check to see users cookies so we can steal their data or check if theyre logged in
    next();


});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'oogabooga',
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: db
    })
}));

app.use('/', loginRoute);
app.use('/loginForm', loginFormRoute);
app.use('/main', mainRoute);
app.use('/createevent', createEventRoute);


app.listen(process.env.PORT || 8000, ()=>{
    console.log('Server is listening on port 8000');
});
