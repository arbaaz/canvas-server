
const { createCanvas } = require('canvas');
const {spawn} = require('child_process');
const fs = require("fs");
const path = require('path');
const { writeFileSync, createWriteStream } = require('fs');

const width = 1200;
const height = 630;

module.exports = function generateVideo(text){
    return new Promise(resolve => {
        const videoFilePath = path.resolve(__dirname, `../videos/output_${Date.now()}.mp4`);
        const ffmpeg = spawnFFmpeg(videoFilePath);
        const canvas = createCanvas(width, height);
        
        let i = 1
        const _interval  = setInterval(() => {
            console.log('Text', text);
            drawOnCanvas(canvas, `${text}-Frame-${i}`);
            ffmpeg.stdin.write(canvas.toBuffer('image/png'));
            // writeFileSync(`image/${text}.png`, canvas.toBuffer('image/png'));
            if(i === 50){
                clearInterval(_interval);
                ffmpeg.stdin.end();
                console.log('Done');
                setTimeout(() => {
                    resolve(videoFilePath);
                }, 100);
            }
            i++;
        }, 10);
    });
}

function spawnFFmpeg(videoFilePath){
    const ffmpeg = spawn('ffmpeg', [
        '-framerate',
        '10',
        '-f',
        'image2pipe',
        '-i',
        '-',
        videoFilePath,
      ]);
    //todo: ffmpeg stream
    
    // detect if ffmpeg was not spawned correctly
    ffmpeg.stderr.setEncoding('utf8');
    ffmpeg.stderr.on('data', function(data) {
        console.log(data);
    });

    return ffmpeg;
}


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
  