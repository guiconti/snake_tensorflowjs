const AMOUNT_OF_ACTIONS = 4;
const UP = 0;
const LEFT = 1;
const RIGHT = 2;
const DOWN = 3;

let action;

let QTable = [];
let rewardList = [];
let learningRate = .8;
let futureSignificancy = .95;
let probabilityToExploit = .1;
let exploitDecay = .1;

let stateColumns;
let stateRows;
let squareSize;

let newState;
let lastState;
let lastAction;

const directions = {
  'right': 'R',
  'left': 'L',
  'up': 'U',
  'down': 'D'
};

function start(gameWidth, gameHeight, pixelsPerSquare){
  learningRate = $('#learningRate').val()/100;
  futureSignificancy = $('#gammaRate').val()/100;
  probabilityToExploit = $('#exploitRate').val()/100;
  exploitDecay = $('#decayExploitRate').val()/100;

  stateColumns = gameWidth/pixelsPerSquare;
  stateRows = gameHeight/pixelsPerSquare;
  squareSize = pixelsPerSquare;
}

function takeAction(){

  let max = Number.MIN_SAFE_INTEGER;
  if (QTable[lastState] == undefined){
    QTable[lastState] = [];
    QTable[lastState][0] = 0;
    QTable[lastState][1] = 0;
    QTable[lastState][2] = 0;
    QTable[lastState][3] = 0;
  }
  if (Math.random() > probabilityToExploit){
    QTable[lastState].forEach((possibleReward, possibleAction) => {
      if (possibleReward > max){
        lastAction = possibleAction;
        max = possibleReward
      }
    });
  } else {
    probabilityToExploit -= probabilityToExploit * exploitDecay;
    lastAction = Math.floor(Math.random() * (AMOUNT_OF_ACTIONS + 1));
  }

  switch(lastAction){
    case UP:
      return('up');
      break;
    case LEFT:
      return ('left');
      break;
    case RIGHT:
      return ('right');
      break;
    case DOWN:
      return ('down');
      break;
  }
}

function generateState(snakeXPoints, snakeYPoints, direction, xFruit, yFruit, isReward = false){
  let currentState = 'B'.repeat(stateColumns * stateRows).split('');
  for (let i = 0; i < snakeXPoints.length; i++){
    let currentPosition = (snakeXPoints[i]/squareSize) + ((snakeYPoints[i]/squareSize) * stateColumns);
    if (i == snakeXPoints.length - 1)
      currentState[currentPosition] = directions[direction];
    else
      currentState[currentPosition] = 'S';
  }
  let currentPosition = (xFruit/squareSize) + ((yFruit/squareSize) * stateColumns);
  currentState[currentPosition] = 'F';
  if (isReward)
    newState = currentState.join('');
  else
    lastState = currentState.join('');
}

function updateTable(reward){
  if (QTable[newState] == undefined){
    QTable[newState] = [];
    QTable[newState][0] = 0;
    QTable[newState][1] = 0;
    QTable[newState][2] = 0;
    QTable[newState][3] = 0;
  }
  let max = Number.MIN_SAFE_INTEGER;
  QTable[newState].forEach((possibleReward, possibleAction) => {
    if (possibleReward > max){
      max = possibleReward
    }
  });
  QTable[lastState][lastAction] = QTable[lastState][lastAction] + learningRate*(reward + futureSignificancy * max - QTable[lastState][lastAction]);
  lastState = newState;
}

const ai = {
  start: start,
  generateState: generateState,
  takeAction: takeAction,
  updateTable: updateTable
};
