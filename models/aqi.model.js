const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//validations

const aqiSchema = new Schema(
  {
    city: { type: String, required: true },
    aqi: { type: Number, required: true },
    status: { type: String, required: true },
    pm25: { type: Number, required: true }
  },
  {
    timestamps: true //created or modified changes display
  }
);

const aqiData = mongoose.model("aqiData", aqiSchema);

module.exports = aqiData; //export user