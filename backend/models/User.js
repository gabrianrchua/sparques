const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: { // hashed with bcrypt
    type: String,
    required: true,
  },
});

// hook to hash password before adding to db
userSchema.pre('save', function (next) {
  // Only hash if it's new
  if (this.isNew || this.isModified("password")) {
    // Saving reference to this because of changing scopes
    const doc = this;
    bcrypt.hash(doc.password, saltRounds,
      (err, hashedPassword) => {
        if (err) {
          next(err);
        } else {
          doc.password = hashedPassword;
          next();
        }
      });
  } else {
    next();
  }
});

userSchema.methods.isCorrectPassword = function(password, callback){
  bcrypt.compare(password, this.password, function(err, same) {
    if (err) {
      callback(err);
    } else {
      callback(err, same);
    }
  });
}

module.exports = mongoose.model('User', userSchema);