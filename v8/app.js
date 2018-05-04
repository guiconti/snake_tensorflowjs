const Matrix = require('./math/Matrix');

let newMatrix = new Matrix(5, 5);

newMatrix.randomize();
console.table(newMatrix);