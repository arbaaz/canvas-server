
const { createCanvas } = require('canvas');
const {spawn} = require('child_process');
const { writeFileSync, createWriteStream } = require('fs');

const width = 1200;
const height = 630;

const ffmpeg = spawn('ffmpeg', [
    '-framerate',
    '10',
    '-f',
    'image2pipe',
    '-i',
    '-',
    'output.mp4',
  ]);
//todo: ffmpeg stream

// detect if ffmpeg was not spawned correctly
ffmpeg.stderr.setEncoding('utf8');
ffmpeg.stderr.on('data', function(data) {
    console.log(data);
    // process.exit(1);
});

const canvas = createCanvas(width, height);

let i = 1
const _interval  = setInterval(() => {
    const text = `Frame-${i}`
    console.log('Text', text);
    drawOnCanvas(canvas, text);
    ffmpeg.stdin.write(canvas.toBuffer('image/png'));
    writeFileSync(`image/${text}.png`, canvas.toBuffer('image/png'));
    i++;
    if(i === 50){
        console.log('Done');
        clearInterval(_interval);
        ffmpeg.stdin.end();
        process.exit(0);
    }
}, 10);



function drawOnCanvas(canvas, text) {
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
  