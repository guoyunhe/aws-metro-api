const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const config = require("../config.json");
const mongoosePaginate = require("mongoose-paginate-v2");

const Photo = new Schema(
  {
    bucket: String,
    key: String,
    name: String,
    mimetype: String,
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

Photo.plugin(mongoosePaginate);

module.exports = mongoose.model("photos", Photo);
