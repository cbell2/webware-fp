var express = require('express');
var router = express.Router();
var mongSetup = require('../mongooseSetup');
var events = require("mongoose").model('events');
var user = require("mongoose").model('user');


var mongoDB = mongSetup.db;
mongSetup.Promise = global.Promise;

/* GET home page. */
router.get('/', function(req, res, next) {

    //THIS IS HOW WE FIND OUT IF SOMEONE IS LOGGED IN
    //FIND USERS BY ID
    //*****####console.log(req.session.userId);####****

    user.findOne({
        email: req.session.email,
        password: req.session.password
    }).populate({
        path: 'eventsOwned',
        model: 'events'
    }).then((someUser) => {
        console.log(someUser);
        // Get all of user's owned events
        // var hasOwned = true;
        // if (eventsOwned.length == 0) {
        //     hasOwned = false;
        // }

        // Get all of user's applied events

        // Get all of user's attending events TODO before time expired?

        // Get and display all available events
        events.find().then((allEvents) => {
            console.log(JSON.stringify(allEvents));
            res.render('index.hbs', {
                title: "Welcome to Yeat",
                // hasOwned: hasOwned,
                // ownedEvents: ownedEvents,
                // hasApplied: hasApplied,
                // appliedEvents: appliedEvents,
                // hasAttending: hasAtending,
                // attendingEvents: attendingEvents,
                allEvents: allEvents,
                username: req.session.email,
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


module.exports = router;
