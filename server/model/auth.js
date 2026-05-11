const mongoose = require('mongoose');

const User = new mongoose.Schema({
    fullname : {
        type : String,
        required : true, 
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String, 
        required : true
    }
})

const auth = mongoose.model("user", User);

module.exports = auth;