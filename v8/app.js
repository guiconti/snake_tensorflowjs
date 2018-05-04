const NeuralNetwork = require('./neural_network/NeuralNetwork');

let nn = new NeuralNetwork(2, 2, 1);

let input = [1,0];

let output = nn.feedForward(input);
console.log(output);