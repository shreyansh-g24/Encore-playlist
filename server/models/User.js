// User model //
let mongoose = require("mongoose");
let jwt = require("jsonwebtoken");

// importing config file
let config = require("./../config/config");

// defining user schema
let userSchema = new mongoose.Schema({
  // name
  name: {
    type: String,
  },
  // login username of the user
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // github email
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // url of the profile pic 
  avatar_url: {
    type: String,
  },
  // songs added by the user
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
  }],
  // playlists created by the user
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
  }],
}, { timestamps: true });

// specifying user fields to be returned upon any query
userSchema.methods.toJSON = function () {
  let user = this;
  let userObject = user.toObject();
  let { username, email, name, avatar_url } = userObject;
  return { username, email, avatar_url, name };
}

// Defining user model and instance methods
// generates auth token
userSchema.methods.generateAuthToken = function () {
  let user = this;
  let token = jwt.sign({ _id: user._id.toHexString() }, config.SECRET);
  return token;
}

// finding user by token
// token: receives a token
// returns a promise, rejecting if error, user if success
userSchema.statics.findByToken = function (token) {
  let User = this;
  let decoded;

  // trying to decode the token, returning a promise with rejection if error
  try {
    decoded = jwt.verify(token, config.SECRET);
  } catch (e) {
    return Promise.reject({ error: e });
  }
  // return User.findOne({ _id: decoded._id }, (err, user) => {
  //   if(err) return Promise.reject({error: err});
  //   return Promise.resolve(user);
  // });
  return User.findOne({ _id: decoded._id });
}

// requiring and exporting model
let User = mongoose.model("User", userSchema);
module.exports = User;
