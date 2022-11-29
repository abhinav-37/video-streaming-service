const express = require("express");
const router = express.Router();
const fs = require("fs");

// get the metadata of all videos
const videos = require("../metadata");
const videoFolder =
  "/mnt/d/The.Sopranos.S01.Season.1.1080p.5.1Ch.BluRay.ReEnc-DeeJayAhmed";

router.get("/", (req, res) => {
  //   fs.readdir(videoFolder, (err, files) => {
  //     files.forEach((file) => {
  //       console.log(file);
  //     });
  //   });

  res.status(200).json(videos);
});

router.get("/:id/metadata", (req, res) => {
  const id = req.params.id;

  res.status(200).json(videos[id]);
});

router.get("/video/:id", (req, res) => {
  const id = req.params.id;
  const path = `${videoFolder}/${id}.mkv`;

  console.log("path: ", path);

  const stat = fs.statSync(path);

  console.log("stat: ", stat);

  const fileSize = stat.size;

  console.log("fileSize: ", fileSize);

  const range = req.headers.range;

  console.log("range: ", range);

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(path, { start, end });

    const head = {
      "Content-Range": `bytes ${start}-${end}/${fileSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": chunksize,
      "Content-Type": "video/mkv",
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      "Content-Length": fileSize,
      "Content-Type": "video/mkv",
    };
    res.writeHead(200, head);
    fs.createReadStream(path).pipe(res);
  }
});

module.exports = router;
