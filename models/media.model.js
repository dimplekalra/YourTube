const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const MediaSchema = new Schema(
  {
    title: {
      type: String,
      required: "Name is Required",
    },
    description: {
      type: String,
    },
    genre: String,
    views: {
      type: Number,
      default: 0,
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
