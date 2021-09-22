const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: "Name is Required",
    },
    email: {
      type: String,
      trim: true,
      unique: "Email Already Exist",
      required: "Email is Required",
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: "Password is Required",
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (this.isModified("password") || this.isNew) {
    user.password = await this.encryptPassword(user.password);
    next();
  } else {
    return next();
  }
});

// UserSchema.virtual("password")
//   .set(async function (password) {
//     this._password = password;
//     this.hashed_password = await this.encryptPassword(password);

//   })
//   .get(function () {
//     return this._password;
//   });

UserSchema.path("password").validate(function (v) {
  if (this.password && this.password.length < 6)
    this.invalidate("password", "password must be 6 characters long");

  if (this.isNew && !this.password)
    this.invalidate("password", "password is required");
}, null);

UserSchema.methods = {
  authenticate: function (password) {
    return bcrypt.compare(password, this.hashed_password);
  },
  encryptPassword: async function (password) {
    try {
      if (!password) return "";

      const salt = await bcrypt.genSalt(10);

      const hashed_password = await bcrypt.hash(password, salt);

      return hashed_password;
    } catch (error) {
      console.log(error);
    }
  },
};

module.exports = mongoose.model("User", UserSchema);
