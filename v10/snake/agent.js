function mutate(x) {
  if (Math.random() < 0.1) {
    let offset = randomGaussian() * 0.5;
    let newX = x + offset;
    return newX;
  } else {
    return x;
  }
}

// Random gaussian variables. This function is not mine, is from p5.js
let previous = false;
let y2 = 0;

function randomGaussian(mean, sd){
  let y1, x1, x2, w;
  if (previous) {
    y1 = y2;
    previous = false;
  } else {
    do {
      x1 = Math.random() * 2 - 1;
      x2 = Math.random() * 2 - 1;
      w = x1 * x1 + x2 * x2;
    } while (w >= 1);
    w = Math.sqrt(-2 * Math.log(w) / w);
    y1 = x1 * w;
    y2 = x2 * w;
    previous = true;
  }

  let m = mean || 0;
  let s = sd || 1;
  return y1 * s + m;
}

const AMOUNT_OF_ACTIONS = 4;
const actions = {
  'up': '0',
  'left': '1',
  'right': '2',
  'down': '3'
};

const indexToAction = ['up', 'left', 'right', 'down'];

class Agent {
  constructor(brain){
    if (brain instanceof NeuralNetwork){
      this.brain = brain.copy();
      this.brain.mutate(mutate);
    } else {
      this.brain = new NeuralNetwork(6, 8, 4);
    }

    this.score = 0;
    this.fitness = 0;
  }

  copy(){
    return new Agent(this.brain);
  }

  takeAction(snakeXCoordinates, snakeYCoordinates, direction, xFruit, yFruit, gameWidth, gameHeight, pixelsPerSquare){

    let inputs = this.makeInput(snakeXCoordinates, snakeYCoordinates, direction, xFruit, yFruit, gameWidth, gameHeight, pixelsPerSquare);
    let predictions = this.brain.predict(inputs);

    let maxPrediction = Number.MIN_SAFE_INTEGER;
    let prediction = 0;
    for (let i = 0; i < predictions.length;i++){
      if (predictions[i] > maxPrediction){
        maxPrediction = predictions[i];
        prediction = i;
      }
    }

    return indexToAction[prediction];
  }

  makeInput(snakeXCoordinates, snakeYCoordinates, direction, xFruit, yFruit, gameWidth, gameHeight, pixelsPerSquare){
    //  
    let inputs = [];

    //  Fix data
    let fixedSnakeXCoordinates = snakeXCoordinates.map(xCoordinate => xCoordinate/pixelsPerSquare);
    let fixedSnakeYCoordinates = snakeYCoordinates.map(yCoordinate => yCoordinate/pixelsPerSquare);
    direction = actions[direction] / AMOUNT_OF_ACTIONS;
    xFruit = xFruit / pixelsPerSquare;
    yFruit = yFruit / pixelsPerSquare;
    gameWidth = gameWidth / pixelsPerSquare;
    gameHeight = gameHeight / pixelsPerSquare;

    let snakeHeadX = fixedSnakeXCoordinates[fixedSnakeXCoordinates.length - 1];
    let snakeHeadY = fixedSnakeYCoordinates[fixedSnakeXCoordinates.length - 1];

    inputs[0] = 0;
    inputs[1] = 0;
    inputs[2] = 0;
    inputs[3] = 0;

    //  Check left and right
    if (snakeHeadX + 1 == gameWidth)
      inputs[1] = 1;
  
    if (snakeHeadX - 1 == 0)
      inputs[3] = 1;

    if (inputs[1] == 0 || inputs[3] == 0){
      for (let i = 0; i < fixedSnakeXCoordinates.length - 1; i++){
        if (snakeHeadX + 1 == fixedSnakeXCoordinates[i])
          inputs[1] = 1;
        else if (snakeHeadX - 1 == fixedSnakeXCoordinates[i])
          inputs[3] = 1;
      }
    }

    //  Check up and down
    if (snakeHeadX + 1 == gameWidth)
      inputs[0] = 1;
  
    if (snakeHeadX - 1 == 0)
      inputs[2] = 1;

    if (inputs[0] == 0 || inputs[2] == 0){
      for (let i = 0; i < fixedSnakeYCoordinates.length - 1; i++){
        if (snakeHeadY + 1 == fixedSnakeYCoordinates[i])
          inputs[0] = 1;
        else if (snakeHeadY - 1 == fixedSnakeYCoordinates[i])
          inputs[2] = 1;
      }
    }

    inputs[4] = direction;

    var angleSnakeToFood = Math.atan2(snakeHeadY - yFruit, snakeHeadX - xFruit) / Math.PI;
    inputs[5] = angleSnakeToFood;

    return inputs;

  }

  updateScore(reward){
    this.score += reward;
  }

}