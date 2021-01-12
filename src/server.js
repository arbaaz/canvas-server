import express from 'express';
import { port } from './config';
import { createCanvas } from 'canvas';
const app = express();

app.get('/', (req, res) => {
  const width = 1200;
  const height = 630;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext('2d');

  context.fillStyle = '#000';
  context.fillRect(0, 0, width, height);

  context.font = 'bold 70pt Menlo';
  context.textAlign = 'center';
  context.textBaseline = 'top';
  context.fillStyle = '#3574d4';

  const text = 'Hello, World!';

  const textWidth = context.measureText(text).width;
  context.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);
  context.fillStyle = '#fff';
  context.fillText(text, 600, 170);

  context.fillStyle = '#fff';
  context.font = 'bold 30pt Menlo';
  context.fillText('flaviocopes.com', 600, 530);
  res.writeHead(200, {'Content-Type': 'image/jpeg'});
  res.end(canvas.toBuffer('image/png'));
});

app.listen(port, () => console.log(
    `Example app listening on port ${port}!`,
));
