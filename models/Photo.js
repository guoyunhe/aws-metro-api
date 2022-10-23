const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config.json");
const Label = require("./Label");

const Photo = new Schema(
  {
    bucket: String,
    key: String,
    originalname: String,
    mimetype: String,
    labels: [Label.schema],
  },
  {
    virtuals: {
      url: {
        get() {
          return config.s3.endpoint + "/" + this.bucket + "/" + this.key;
        },
      },
    },
  }
);

module.exports = mongoose.model("photos", Photo);
