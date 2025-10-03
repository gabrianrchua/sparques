/* eslint-disable no-restricted-syntax */
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      // hashed with bcrypt
      type: String,
      required: true,
    },
  },
  {
    methods: {
      isCorrectPassword(
        password: string,
        callback: (err: Error | undefined, same?: boolean) => void,
      ) {
        bcrypt.compare(password, this.password, (err, same) => {
          if (err) {
            callback(err);
          } else {
            callback(err, same);
          }
        });
      },
    },
  },
);

// hook to hash password before adding to db
userSchema.pre('save', function (next) {
  // Only hash if it's new
  if (this.isNew || this.isModified('password')) {
    // Saving reference to this because of changing scopes
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const doc = this;
    bcrypt.hash(doc.password, saltRounds, (err, hashedPassword) => {
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

export default mongoose.model('User', userSchema);
