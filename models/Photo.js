const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Label = require("./Label");

const Photo = new Schema(
  {
    key: String,
    originalname: String,
    mimetype: String,
    labels: [Label.schema],
  },
  {
    virtuals: {
      url: {
        get() {
          return (
            process.env.S3_ENDPOINT + "/" + process.env.S3_BUCKET,
            +"/" + this.key
          );
        },
      },
    },
  }
);

module.exports = mongoose.model("photos", Photo);
