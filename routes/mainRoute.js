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
        model: 'events',
        populate: {
            path: 'requested attending',
            model: 'user'
        }
    }).populate({
        path: 'eventsApplied',
        model: 'events'
    }).populate({
        path: 'eventsAttending',
        model: 'events'
    }).then((someUser) => {
        // console.log('Populated Event:');
        // console.log(someUser.eventsOwned);
        //console.log(someUser.eventsApplied);
        //console.log(someUser.eventsAttending);
        events.find().then((allEvents) => {

            res.render('index.hbs', {
                title: "Welcome to Yeat",
                eventsOwned: someUser.eventsOwned,
                eventsApplied: someUser.eventsApplied,
                eventsAttending: someUser.eventsAttending,
                allEvents: allEvents,
                username: someUser.name,
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
                });
                res.end();
        });
});

router.post('/acceptRequest', function(req, res, next) {
    user.findOne({
            _id: req.body.userId
    }).populate({
        path: 'eventsApplied',
        model: 'events'
    }).populate({
        path: 'eventsAttending',
        model: 'events'
    }).then((someUser) => {
        events.findOne({
            _id: req.body.eventId
        }).populate({
            path: 'requested',
            model: 'user'
        }).populate({
            path: 'attending',
            model: 'user'
        }).then((someEvent)=>{
            // Remove from requested, add to attending
            someEvent.attending.push(someUser);
            for (var i = 0; i < someEvent.requested.length; i++) {
                if (someEvent.requested[i]._id.toString() == someUser._id.toString()) {
                    someEvent.requested.splice(i, 1);
                }
            }
            someEvent.save();

            // Remove from applied, add to attending
            someUser.eventsAttending.push(someEvent);
            for (var i = 0; i < someUser.eventsApplied.length; i++) {
                if (someUser.eventsApplied[i]._id.toString() == someEvent._id.toString()) {
                    someUser.eventsApplied.splice(i, 1);
                }
            }
            someUser.save();
        });
        res.end();
    });
});

router.delete('/declineRequest', function(req, res, next) {
    user.findOne({
            _id: req.body.userId
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
            // Remove from requested
            for (var i = 0; i < someEvent.requested.length; i++) {
                if (someEvent.requested[i]._id.toString() == someUser._id.toString()) {
                    someEvent.requested.splice(i, 1);
                }
            }
            someEvent.save();

            // Remove from applied
            for (var i = 0; i < someUser.eventsApplied.length; i++) {
                if (someUser.eventsApplied[i]._id.toString() == someEvent._id.toString()) {
                    someUser.eventsApplied.splice(i, 1);
                }
            }
            someUser.save();
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
