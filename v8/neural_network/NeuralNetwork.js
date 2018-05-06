const Matrix = require('../math/Matrix');

function sigmoid(x){
  return 1/ (1 + Math.exp(-x));
}

class NeuralNetwork{
  constructor(inputNode, hiddenNodes, outputNodes){
    this.inputNode = inputNode;
    this.hiddenNodes = hiddenNodes;
    this.outputNodes = outputNodes;

    this.weightsInputHidden = new Matrix(this.hiddenNodes, this.inputNode);
    this.weightsHiddenOutput = new Matrix(this.outputNodes, this.hiddenNodes);
    this.weightsInputHidden.randomize();
    this.weightsHiddenOutput.randomize();

    this.biasHidden = new Matrix(this.hiddenNodes, 1);
    this.biasOutput = new Matrix(this.outputNodes, 1);
    this.biasHidden.randomize();
    this.biasOutput.randomize();

    this.setLearningRate();
  }

  predict(inputArray){

    let input = Matrix.fromArray(inputArray);

    let hidden = Matrix.multiply(this.weightsInputHidden, input);
    hidden.add(this.biasHidden);
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.weightsHiddenOutput, hidden);
    output.add(this.biasOutput);
    output.map(sigmoid);

    return output.toArray();
  }

  train(inputArray, targetArray) {

    // Generating the Hidden Outputs
    let inputs = Matrix.fromArray(inputArray);

    // Feedforward
    let hidden = Matrix.multiply(this.weightsInputHidden, inputs);
    hidden.add(this.biasHidden);
    hidden.map(sigmoid);

    let outputs = Matrix.multiply(this.weightsHiddenOutput, hidden);
    outputs.add(this.biasOutput);
    outputs.map(sigmoid);

    // Convert array to matrix object
    let targets = Matrix.fromArray(targetArray);

    // Calculate the error
    // ERROR = TARGETS - OUTPUTS
    let outputErrors = Matrix.subtract(targets, outputs);

    // let gradient = outputs * (1 - outputs);
    // Calculate gradient
    let gradients = Matrix.map(outputs, sigmoid);
    gradients.multiply(outputErrors);
    gradients.multiply(this.learningRate);


    // Calculate deltas
    let hiddenTransposed = Matrix.transpose(hidden);
    let weightsHiddenOutputDeltas = Matrix.multiply(gradients, hiddenTransposed);

    // Adjust the weights by deltas
    this.weightsHiddenOutput.add(weightsHiddenOutputDeltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.biasOutput.add(gradients);

    // Calculate the hidden layer errors
    let weightsHiddenOutputTransposed = Matrix.transpose(this.weightsHiddenOutput);
    let hiddenErrors = Matrix.multiply(weightsHiddenOutputTransposed, outputErrors);

    // Calculate hidden gradient
    let hiddenGradient = Matrix.map(hidden, sigmoid);
    hiddenGradient.multiply(hiddenErrors);
    hiddenGradient.multiply(this.learningRate);

    // Calcuate input->hidden deltas
    let inputsTransposed = Matrix.transpose(inputs);
    let weightsInputHiddenDeltas = Matrix.multiply(hiddenGradient, inputsTransposed);

    this.weightsInputHidden.add(weightsInputHiddenDeltas);
    // Adjust the bias by its deltas (which is just the gradients)
    this.biasHidden.add(hiddenGradient);
  }

  setLearningRate(learningRate = 0.1) {
    this.learningRate = learningRate;
  }

}

module.exports = NeuralNetwork;