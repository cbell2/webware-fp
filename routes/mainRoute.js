var express = require('express');
var router = express.Router();
var mongSetup = require('../mongooseSetup');
var events = require("mongoose").model('events');
var user = require("mongoose").model('user');


var mongoDB = mongSetup.db;
mongSetup.Promise = global.Promise;

/* GET home page. */
router.get('/', function(req, res, next) {
    user.findOne({
        _id: req.session.userId
    }).populate({
        path: 'eventsOwned',
        model: 'events'
    }).populate({
        path: 'eventsApplied',
        model: 'events'
    }).populate({
        path: 'eventsAttending',
        model: 'events'
    }).then((someUser) => {
        events.find().then((allEvents) => {
            console.log(someUser.eventsOwned);
            console.log(someUser.eventsApplied);
            console.log(someUser.eventsAttending);
            res.render('index.hbs', {
                title: "Welcome to Yeat",
                eventsOwned: someUser.eventsOwned,
                eventsApplied: someUser.eventsApplied,
                eventsAttending: someUser.eventsAttending,
                allEvents: allEvents,
                username: someUser.email,
                bio: someUser.bio,
                fave: someUser.fave
            });
        }, (err) => {
            console.log('Error getting events from database.');
            throw err;
        });
    });
});

router.post('/requestEvent', function(req, res, next) {
    user.findOne({
            _id: req.session.userId
        }).populate({
            path: 'eventsApplied',
            model: 'events'
        }).then((someUser) => {
                events.findOne({
                    _id: req.body.eventId
                }).populate({
                    path: 'requested',
                    model: 'user'
            }).then((someEvent)=>{
                someEvent.requested.push(someUser);
                someEvent.save();
                someUser.eventsApplied.push(someEvent);
                someUser.save();
                console.log(someEvent);
                });
                res.end();
        });
});

router.post('/changeBioFave', function(req, res, next){
    console.log('Changing a user\'s bio or fave');
    user.findOne({
        _id: req.session.userId
    }).then((someUser) => {
        if(req.body.bio)
            someUser.bio = req.body.bio;
        else
            someUser.fave = req.body.fave;
        someUser.save().then(()=>{
            res.end()
        })
    });
});

module.exports = router;
