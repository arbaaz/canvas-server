import express from 'express';
import { port } from './config';
import fs from 'fs';
import { generateVideoFile } from './ffmpeg_cli';
import ffmpeg from 'fluent-ffmpeg';
import { createCanvas } from 'canvas';
const Readable = require('stream').Readable

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');


const app = express();

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

function imageGenerator() {
  let i = 0;

  const stream = new Readable({
    objectMode: false,
    read() { }
  })


  const _interval = setInterval(() => {
    drawText('Frame-'+i.toString());
    stream.push(canvas.toBuffer('image/png'));
    
    if (i === 10) {
      clearInterval(_interval);
      stream.push(null)
    }
    
    i++;

  }, 100)

  return stream
}

function drawText(text) {
  console.log('text:', text);
  context.fillStyle = '#000';
  context.fillRect(0, 0, width, height);

  context.font = 'bold 70pt Menlo';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = '#3574d4';

  const textWidth = context.measureText(text).width;
  context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);
  context.fillStyle = '#fff';
  context.fillText(text, 600, 170);

  context.fillStyle = '#fff';
  context.font = 'bold 30pt Menlo';
  context.fillText('invideo.io', 600, 530);
}


app.get('/videos.mp4', (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range || 'bytes=0-';
  const text = req.query.text || 'Frame';
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  const headers = {
    "Content-Type": "video/mp4",
  };

  res.writeHead(206, headers);

  ffmpeg(imageGenerator())
  .format("image2pipe")
  .fps(1)
  .on('end', function () {
    console.log('file has been converted succesfully');
  })
  .on('error', function (err, stdout, stderr) {
    console.log('Error: ' + err.message);
    console.log('ffmpeg output:\n' + stdout);
    console.log('ffmpeg stderr:\n' + stderr);
  })
  .pipe(res, { end: true })
});



app.get('/video', (req, res) => {
  // Ensure there is a range given for the video
  const range = req.headers.range || 'bytes=0-';
  const text = req.query.text || 'Frame';
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  generateVideoFile(text).then((videoPath) => {
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

