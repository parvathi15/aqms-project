const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//validations

const userSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }
  },
  {
    timestamps: true //created or modified changes display
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User; //export user
