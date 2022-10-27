const express = require("express");
const router = express.Router();
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
var multer = require("multer");
var multerS3 = require("multer-s3");
const Photo = require("../models/Photo");

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT,
  region: process.env.S3_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

var upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET,
    acl: "public-read",
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
});

router.get("/", function (req, res, next) {
  Photo.find()
    .then((data) => {
      res
        .status(200)
        .send(data.map((item) => item.toObject({ virtuals: true })));
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:photoId", function (req, res, next) {
  Photo.findById(req.params.photoId)
    .then((data) => {
      res.status(200).send(data.toObject({ virtuals: true }));
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/", upload.array("file"), function (req, res, next) {
  Promise.all(
    req.files.map(async (file) => {
      const photo = new Photo(file);
      await photo.save();
    })
  )
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:photoId", function (req, res, next) {
  Photo.findByIdAndRemove(req.params.photoId)
    .then((photo) => {
      s3.send(
        new DeleteObjectCommand({
          Bucket: process.env.S3_BUCKET,
          Key: photo.key,
        })
      );
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:photoId/labels/", function (req, res, next) {
  Photo.findById(req.params.photoId)
    .then((photo) => {
      photo.labels.push(req.body);
      return photo.save();
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:photoId/labels/:labelId", function (req, res, next) {
  Photo.findById(req.params.photoId)
    .then((photo) => {
      res.status(200).send(photo.labels.id(req.params.labelId));
    })
    .catch((err) => {
      next(err);
    });
});

router.patch("/:photoId/labels/:labelId", function (req, res, next) {
  Photo.findById(req.params.photoId)
    .then((photo) => {
      const label = photo.labels.id(req.params.labelId);
      label.catalog = req.body.catalog;
      return photo.save();
    })
    .then((photo) => {
      res.status(200).send(photo.labels.id(req.params.labelId));
    })
    .catch((err) => {
      next(err);
    });
});

router.delete("/:photoId/labels/:labelId", function (req, res, next) {
  Photo.findById(req.params.photoId)
    .then((photo) => {
      photo.labels.id(req.params.labelId).remove();
      return photo.save();
    })
    .then(() => {
      res.status(200).send();
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
