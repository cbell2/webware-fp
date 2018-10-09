var express = require('express');
var router = express.Router();
var mongSetup = require('../mongooseSetup');
var events = require("mongoose").model('events');
var user = require("mongoose").model('user');


var mongoDB = mongSetup.db;
mongSetup.Promise = global.Promise;

/* GET home page. */
router.get('/', function(req, res, next) {

            res.render('createEvent.hbs', {
                title: "Welcome to Yeat",

            });



});

router.post('/', function(req, res, next){
    if (req.body.bookname &&
        req.body.time &&
        req.body.desc &&
        req.body.location &&
        req.body.capacity){
        res.render('createEvent.hbs', {
            title: "Create Event",
            message: "SUCCESS"
        });
        console.log('got everything');
        //TODO create an event
    }
    else{
        res.render('createEvent.hbs', {
            title: "Create Event",
            message: "YOINKS THAT DON'T FLY AROUND HERE"
        });
        console.log("did not get everything");
        /*
        TODO render page again with hbs but include error message field and add that above the form
        IT is now TODONE
         */
    }
});

module.exports = router;
