import Readable from 'stream';
import { createCanvas } from 'canvas';

const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

export function getCanvasImage(){
  return canvas.toBuffer('image/png')
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
