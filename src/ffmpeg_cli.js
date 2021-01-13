import path from 'path';
import { drawText, getCanvasImage } from './frame_counter';
import { spawn } from 'child_process';

export function generateVideoFile(text) {
  return new Promise(resolve => {
    const videoFilePath = path.resolve(__dirname, `../out/videos/output_${Date.now()}.mp4`);
    const ffmpeg = spawnFFmpeg(videoFilePath);

    let i = 1
    const _interval = setInterval(() => {
      drawText(`${text}-Frame-${i}`);
      ffmpeg.stdin.write(getCanvasImage());
      if (i === 50) {
        clearInterval(_interval);
        ffmpeg.once('exit', () => {
          resolve(videoFilePath);
        })
        ffmpeg.stdin.end();
      }
      i++;
    }, 10);
  });
}

function spawnFFmpeg(videoFilePath) {
  const ffmpeg = spawn('ffmpeg', [
    '-framerate',
    '10',
    '-f',
    'image2pipe',
    '-i',
    '-',
    videoFilePath,
  ]);

  // detect if ffmpeg was not spawned correctly
  ffmpeg.stderr.setEncoding('utf8');
  ffmpeg.stderr.on('data', function (data) {
    console.log(data);
  });

  return ffmpeg;
}
