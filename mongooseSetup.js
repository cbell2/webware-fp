const mongoose = require('mongoose');
var Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
var mongoURL = "mongodb://heroku_jn145n91:2oif26fjs7r3usf6erstq4skef@ds235785.mlab.com:35785/heroku_jn145n91";
mongoose.connect(mongoURL, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error'));

var events = mongoose.model("events", {
    name: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    maxAttendance: {
        type: Number,
        required: true
    },
    currentAttendance: {
        type: Number
    },

    foods: [{
        type: String
    }],
    beverages: [{
        type: String
    }]
});


var user = mongoose.model("user", {
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    eventsOwned: [{ type: Schema.Types.ObjectId, ref: events}],

    eventsAttending: [{ type: Schema.Types.ObjectId, ref: events}],

    eventsApplied: [{ type: Schema.Types.ObjectId, ref: events}]

});

module.exports.db = db;
module.exports.events = events;
module.exports.user = user;

// var randomSeltzer = new seltzers({
//     seltzer: "Polar Seltzer Variety Pack",
//     seltzerID: 1,
//     quantity: 20,
//     size: "12 fl oz",
//     brand: "Polar",
//     price: 7.99
// });
//
// randomSeltzer.save().then((doc) => {
//     console.log(doc);
// }, (e) => {
//     console.log("There was an error: ", e);
//     throw e
// });
