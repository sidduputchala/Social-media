const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userschema = new schema({
    
   username: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required:true
    },

    contactnumber:{
        type:Number,
        required:true
    },

    address: {
        type: String,
        required:true
    },

    zipcode: {
        type: Number,
        required:true
    },

    city: {
        type: String,
        required:true
    },

    state: {
        type: String,
        required:true

    },
    followers:{
        type:Array,
    },
    following:{
        type:Array,
    },
    posts:{
        type:Array,
    },
});

const user = mongoose.model('User', userschema);
module.exports = user;
