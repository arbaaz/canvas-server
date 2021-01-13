import express from 'express';
import { port } from './config';
import fs, { promises } from 'fs';
import path from 'path';
import { FrameCounter, generateVideo, generateOutputStream } from './test';
import ffmpeg from 'fluent-ffmpeg';

const width = 1200;
const height = 630;

const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.get('/videos', (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range || 'bytes=0-';
  const text = req.query.text || 'Frame';
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const videoStream = new FrameCounter();

  const headers = {
    "Content-Type": "video/mp4",
  };

  res.writeHead(200, headers);
    ffmpeg(videoStream)
      .format("image2pipe")
      .fps(10)
      // .outputOptions("-preset ultrafast")
      .on('end', function() {
        console.log('file has been converted succesfully');
      })
      .on('error', function(err) {
        console.log('an error happened: ' + err.message);
      })
      .pipe(res)
});



app.get('/video', (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range || 'bytes=0-';
  const text = req.query.text || 'Frame';
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  generateVideo(text).then((videoPath) => {
    // const videoPath = path.resolve(__dirname, "../output.mp4");
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range
    // Example: "bytes=32324-"
    const CHUNK_SIZE = 10 ** 6; // 1MB
    // const CHUNK_SIZE = 10 ** 3; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    // Create headers
    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    // HTTP Status 206 for Partial Content
    res.writeHead(206, headers);

    // create video read stream for this particular chunk
    const videoStream = fs.createReadStream(videoPath, { start, end });

    // Stream the video chunk to the client
    videoStream.pipe(res);
  }).catch(e => {
    console.log(e);
  })
});


app.listen(port, () => console.log(
  `Example app listening on port ${port}!`,
));

