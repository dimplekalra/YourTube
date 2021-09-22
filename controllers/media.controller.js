const _ = require("lodash");
const formidable = require("formidable");
const fs = require("fs");
const Media = require("../models/media.model");

const errorHandler = require("../helpers/dbErrorHandler");
const mongoose = require("mongoose");
const Grid = require("gridfs-stream");
const { convertVideoToThumbnail } = require("../helpers/util");

let gfs = null;

function readableToDatabase(readable, writeable) {
  return new Promise((resolve, reject) => {
    const temp = readable.pipe(writeable);
    resolve(temp);

    // let data = "";
    // readable.on("data", function (chunk) {
    //   writeable.write(chunk);
    //   data += chunk;
    // });
    // readable.on("end", function () {
    //   resolve(writeable);
    // });
    // readable.on("error", function (err) {
    //   reject(err);
    // });
  });
}

eval(
  `Grid.prototype.findOne = ${Grid.prototype.findOne
    .toString()
    .replace("nextObject", "next")}`
);

Grid.mongo = mongoose.mongo;

mongoose.connection.on("connected", () => {
  gfs = Grid(mongoose.connection.db);
  // gfs.collection("uploads");
  console.log("connection established");
});

const AsyncStoringFile = async (path, media) => {
  let temp, stream;
  temp = fs.createReadStream(path);

  stream = temp.pipe(gfs.createWriteStream({ _id: media._id }));

  return await new Promise((resolve, reject) => {
    temp.on("end", resolve);
    temp.on("error", reject);
  });
};

const create = async (req, res, next) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "Video could not be uploaded",
      });
    }
    let media = new Media(fields);
    media.postedBy = req.profile;

    let stream;

    if (files.video) {
      await AsyncStoringFile(files.video.path, media);
    }

    return media.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(result);
    });
  });
};

const mediaById = (req, res, next, id) => {
  Media.findById(id)
    .populate("postedBy")
    .exec((err, media) => {
      if (err) {
        return res.status(400).json({
          message: "Media not Found",
        });
      }

      if (!media) {
        return res.status(400).json({
          message: "Media not Found",
        });
      }

      req.media = media;
      next();
    });
};

const video = async (req, res) => {
  await gfs.findOne(
    {
      _id: req.media._id,
    },
    (err, file) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }

      if (!file) {
        return res.status(404).json({
          message: "Media Not Found",
        });
      }

      if (req.headers["range"]) {
        let parts = req.headers["range"].replace(/bytes=/, "").split("-");
        let start = parts[0];
        let end = parts[1];

        start = parseInt(start, 10);
        end = end ? parseInt(end, 10) : file.length - 1;
        let chunkSize = end - start + 1;

        res.writeHead(206, {
          "Accept-Ranges": "bytes",
          "Content-Length": chunkSize,
          "Content-Range": `bytes ${start}-${end}/${file.length}`,
          "Content-Type": file.contentType,
        });

        gfs
          .createReadStream({
            _id: file._id,
            range: { startPos: start, endPos: end },
          })
          .pipe(res);
      } else {
        res.header("Content-Length", file.length);
        res.header("Content-Type", file.contentType);

        gfs
          .createReadStream({
            _id: file._id,
          })
          .pipe(res);
      }
    }
  );
};

const listPopular = (req, res) => {
  return Media.find({})
    .limit(10)
    .populate("postedBy", "_id name")
    .sort("-views")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      return res.json(posts);
    });
};
const listByUser = (req, res) => {
  return Media.find({ postedBy: req.profile._id })
    .populate("postedBy", "_id name")
    .sort("-createdOn")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          message: errorHandler.getErrorMessage(err),
        });
      }
      return res.json(posts);
    });
};

const read = (req, res) => {
  return res.json(req.media);
};

const incrementViews = (req, res, next) => {
  return Media.findByIdAndUpdate(
    req.media._id,
    {
      $inc: { views: 1 },
    },
    { new: true }
  ).exec((err, result) => {
    if (err) {
      return res.status(400).json({
        message: errorHandler.getErrorMessage(err),
      });
    }
    next();
  });
};
const isPoster = (req, res, next) => {
  let isPoster =
    req.media &&
    req.auth &&
    req.media.postedBy._id.toString() === req.auth._id.toString();

  if (!isPoster) {
    return res.status(403).json({
      message: "error not authorized",
    });
  }
  next();
};

const update = (req, res, next) => {
  let media = req.media;
  media = _.extend(media, req.body);
  media.updatedOn = Date.now();
  return media.save((err) => {
    if (err) {
      return res.status(400).send({
        error: errorHandler.getErrorMessage(err),
      });
    }
    res.json(media);
  });
};

const remove = (req, res) => {
  const media = req.media;

  return media.remove((err, deletedMedia) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err),
      });
    }
    gfs.remove({ _id: media._id });
    res.json(deletedMedia);
  });
};

const listRelated = async (req, res) => {
  Media.find({ _id: { $ne: req.media }, genre: req.media.genre })
    .limit(4)
    .sort("-views")
    .populate("postedBy", "_id name")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(posts);
    });
};

const listMedias = (req, res) => {
  return Media.find()
    .populate("postedBy", "_id name")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler.getErrorMessage(err),
        });
      }
      res.json(posts);
    });
};

module.exports = {
  create,
  mediaById,
  listMedias,
  video,
  listPopular,
  listByUser,
  read,
  incrementViews,
  isPoster,
  update,
  remove,
  listRelated,
};
