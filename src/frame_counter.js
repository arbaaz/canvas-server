import Readable from 'stream';
import { createCanvas } from 'canvas';

const width = 1200;
const height = 630;
export const canvas = createCanvas(width, height);
const context = canvas.getContext('2d');

initFrame();

export class FrameCounter extends Readable {
  constructor(opt) {
    super(opt);
    this._max = 50;
    this._index = 0;    
  }

  _read() {
    const i = this._index++;
    if (i > this._max)
      this.push(null);
    else {
      drawText(canvas, `Frame-${i}`);
      this.push(canvas.toBuffer('image/png'));
    }
  }
}

export function drawText(text){
  context.fillText(text, 600, 170);
}

export function getCanvasImage(){
  return canvas.toBuffer('image/png')
}

function initFrame() {
  const text  = "Ready";
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
