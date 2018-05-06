const NeuralNetwork = require('./neural_network/NeuralNetwork');

let nn = new NeuralNetwork(2, 2, 1);

let inputs = [1,0];
//let output = nn.feedForward(input);

let target = [1];

for (let i = 0; i < 1000; i++){
  nn.train(inputs, target);
  console.log(nn.predict(inputs));
}
