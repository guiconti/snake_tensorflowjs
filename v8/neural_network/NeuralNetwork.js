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
  }

  feedForward(inputArray){

    let input = Matrix.fromArray(inputArray);

    let hidden = Matrix.multiply(this.weightsInputHidden, input);
    hidden.add(this.biasHidden);
    hidden.map(sigmoid);

    let output = Matrix.multiply(this.weightsHiddenOutput, hidden);
    output.add(this.biasOutput);
    output.map(sigmoid);

    return output.toArray();
  }

}

module.exports = NeuralNetwork;