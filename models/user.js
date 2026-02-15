const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema ({
    email: {
        type:String,
        required:true,
    },

});

// Many modern libraries (including newer versions of passport-local-mongoose or libraries written in TypeScript) are written using the modern ES Module standard.
// When you use the old require() syntax to load a modern library, Node.js or your build tool often wraps the library in an object to preserve the distinction between "named" exports and the "default" export.

userSchema.plugin(passportLocalMongoose.default);
module.exports = mongoose.model("User" , userSchema);