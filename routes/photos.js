const express = require("express");
const router = express.Router();

const { S3Client } = require("@aws-sdk/client-s3");
var multer = require("multer");
var multerS3 = require("multer-s3");

const s3 = new S3Client({
  region: "us-east-1",
  endpoint: "http://s3.localhost.localstack.cloud:4566",
  credentials: {
    accessKeyId: "test",
    secretAccessKey: "test",
  },
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "test",
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.post("/", upload.array("file"), function (req, res, next) {
  res.send({
    data: req.files,
    msg: "Successfully uploaded " + req.files + " files!",
  });
});

module.exports = router;
