import express from 'express';
import { port } from './config';
import { createCanvas } from 'canvas';
import {spawn} from 'child_process';

const width = 1200;
const height = 630;

const app = express();

const child = spawn('ffmpeg', [
  '-framerate',
  '10',
  '-f',
  'image2pipe',
  '-i',
  '-',
  'output.mp4',
]);

child.once('error', (err) => {
  console.log(err);
});

app.get('/', (req, res) => {
  const canvas = createCanvas(width, height);
  drawOnCanvas(canvas);
  res.writeHead(200, {
    'Content-Type': "image/png",
  });
  
  res.end(canvas.toBuffer('image/png'));
  // res.send(`
  // <video id="videoPlayer" controls>
  // <source src="http://localhost:8080/video.mp4" type="video/mp4">
  // </video>
  // `);
});

app.get('/video.mp4', (req, res) => {
  const canvas = createCanvas(width, height);
  drawOnCanvas(canvas);
  res.writeHead(200, {
    'Content-Type': 'video/mp4',
  });
  child.stdin.write(canvas.toBuffer('image/png'));
  child.stdout.on('data', (data) => {
    res.write(data);
  });
  child.stdin.end();
  res.end();
});


app.listen(port, () => console.log(
    `Example app listening on port ${port}!`,
));


function drawOnCanvas(canvas) {
  const text = "Frame-1"
  const context = canvas.getContext('2d');

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
