const ffprobePath = require("@ffprobe-installer/ffprobe").path;
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;

const ffmpeg = require("fluent-ffmpeg");
const ThumbnailGenerator = require("video-thumbnail-generator").default;

function base64_encode(file) {
  // read binary data
  var bitmap = fs.readFileSync(file);
  // convert binary data to base64 encoded string
  return new Buffer(bitmap).toString("base64");
}

function convertVideoToThumbnail(file) {
  ffmpeg.setFfprobePath(ffprobePath);
  ffmpeg.setFfmpegPath(ffmpegPath);

  ffmpeg(file)
    .on("filenames", function (filenames) {
      console.log("Will generate " + filenames.join(", "), filenames);
    })
    .on("end", function () {
      console.log("Screenshots taken");
    })
    .screenshots({
      // Will take screens at 20%, 40%, 60% and 80% of the video
      count: 4,
      folder: "/",
    });
}

// const convertVideoToThumbnail = (file) => {
//   const tg = new ThumbnailGenerator({
//     sourcePath: file,
//     thumbnailPath: "/tmp/",
//   });

//   tg.generateOneByPercent(90).then(console.log);
// };

module.exports = {
  convertVideoToThumbnail,
};
