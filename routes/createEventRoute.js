var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var events = require("mongoose").model('events');
var user = require("mongoose").model('user');
var mongSetup = require('../mongooseSetup');


var mongoDB = mongSetup.db;
mongoDB.Promise = global.Promise;

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
        console.log(req.session.userId);
        //TODO create an event
        user.findOne({
            _id: req.session.userId,
        }).populate({
            path: 'eventsOwned',
            model: 'events'}).then((someUser) => {
            console.log(JSON.stringify(someUser));
            var newEvent = new events({
                name: req.body.bookname,
                date: req.body.time,
                description: req.body.desc,
                maxAttendance: req.body.capacity,
            });
            newEvent.save().then(()=>{
                someUser.eventsOwned.push(newEvent);
                someUser.save().then((doc)=>{
                   console.log(doc);
                });
            });

        })
        //     var eventsOwned = someUser.eventsOwned;
        //     console.log(JSON.stringify(someUser));
        //     console.log("here are my evenets: " + eventsOwned);
        //
        //     }), (err) => {
        //         console.log('Could not get user from the server');
        //         throw err;
        // };
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
