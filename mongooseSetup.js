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
    description: {
        type: String
    },
    image: {
        type: String
    },
    maxAttendance: {
        type: Number,
        required: true
    },
    currentAttendance: {
        type: Number
    }
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

// var event = new events({
//     name: "testy2",
//     date: "tomorrow",
//     maxAttendance: 420,
//     currentAttendance: 69,
//     image: "https://res.cloudinary.com/teepublic/image/private/s--T2YwGf-3--/t_Resized%20Artwork/c_crop,x_10,y_10/c_fit,w_465/c_crop,g_north_west,h_620,w_465,x_0,y_0/g_north_west,u_upload:v1446840652:production:blanks:ymwlojdlb9pdlxgcmck4,x_-391,y_-276/b_rgb:eeeeee/c_limit,f_jpg,h_630,q_90,w_630/v1512231713/production/designs/39441_1.jpg",
//     description: "eat some food drink some brews"
// });
//
// event.save().then((doc) => {
//     console.log(doc);
// }, (e) => {
//     console.log("There was an error: ", e);
//     throw e;
// });
