const mongoose = require('mongoose');

async function connectDB(url) {
    try{
        await mongoose.connect(url)
        console.log("Connected to MongoDB");
    }
    catch(e){
        console.log("Error in connection", e);
    }
}

module.exports = {
    connectDB
}
