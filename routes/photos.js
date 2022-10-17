const { S3Client } = require('@aws-sdk/client-s3');
var multer = require("multer");
var multerS3 = require("multer-s3");

const s3 = new S3Client();

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "guoyunhe-metro-bucket",
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

app.post("/upload", upload.array("photos"), function (req, res, next) {
  res.send({
    data: req.files,
    msg: "Successfully uploaded " + req.files + " files!",
  });
});
