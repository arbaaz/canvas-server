const Readable = require('stream').Readable
import ffmpeg from 'fluent-ffmpeg';
import { createWriteStream } from 'fs';
import { createCanvas } from 'canvas';

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

function imageGenerator() {
  let i = 0;

  const stream = new Readable({
    objectMode: false,
    read() { }
  })


  const _interval = setInterval(() => {
    drawText('Frame-'+i.toString());
    stream.push(canvas.toBuffer('image/png'));
    
    if (i === 50) {
      clearInterval(_interval);
      stream.push(null)
    }
    
    i++;

  }, 10)

  return stream
}


export function drawText(text) {
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


ffmpeg(imageGenerator())
  .format("image2pipe")
  .fps(10)
  .on('end', function () {
    console.log('file has been converted succesfully');
    process.exit();
  })
  .on('error', function (err, stdout, stderr) {
    console.log('Error: ' + err.message);
    console.log('ffmpeg output:\n' + stdout);
    console.log('ffmpeg stderr:\n' + stderr);
    process.exit();
  })
  // .save('out/videos/test.mp4')
  .pipe(createWriteStream('out/videos/test.mp4'), { end: true })
