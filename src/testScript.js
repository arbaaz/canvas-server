
import {drawText, getCanvasImage} from './frame_counter';

export function generateOutputStream(text, outStream) {
  let i = 1;
  const _interval = setInterval(() => {
    drawText(`${text}-Frame-${i}`);
    outStream.write(getCanvasImage());
    if (i === 50) {
      clearInterval(_interval);
      outStream.end();
    }
    i++;
  }, 10);
}

