// Transpile all code following this line with babel and use
// '@babel/preset-env' (aka ES6) preset
// TL;DR This file allows for ES6 notation.
require('@babel/register')({
    presets: ['@babel/preset-env'],
});

// Import the rest of our application.
module.exports = require('./testScript');
