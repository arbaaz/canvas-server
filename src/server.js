import express from 'express';
import {port} from './config';

const app = express();

app.get('/', (req, res) => res.send('Hello World!'));

app.listen(port, () => console.log(
    `Example app listening on port ${port}!`
));
