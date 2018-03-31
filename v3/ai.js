const AMOUNT_OF_ACTIONS = 4;
const UP = 0;
const LEFT = 1;
const RIGHT = 2;
const DOWN = 3;

let action;

let QTable = [];
let rewardList = [];
let learningRate = .8;
let gamma = .95;

let lastState;
let lastAction;

function start(possibleStates, possibleActions){
}

function takeAction(snakeXPoints, snakeYPoints, xFruit, yFruit, gameWidth, gameHeight){
  lastState = snakeXPoints.join('').toString() + snakeYPoints.join('').toString() + xFruit.toString() + yFruit.toString() + gameWidth.toString() + gameHeight.toString();
  let max = Number.MIN_SAFE_INTEGER;
  if (QTable[lastState] == undefined){
    QTable[lastState] = [];
    QTable[lastState][0] = 0;
    QTable[lastState][1] = 0;
    QTable[lastState][2] = 0;
    QTable[lastState][3] = 0;
  }
  QTable[lastState].forEach((possibleReward, possibleAction) => {
    if (possibleReward > max){
      lastAction = possibleAction;
      max = possibleReward
    }
  });
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

function updateTable(reward, snakeXPoints, snakeYPoints, xFruit, yFruit, gameWidth, gameHeight){
  let newState = snakeXPoints.join('').toString() + snakeYPoints.join('').toString() + xFruit.toString() + yFruit.toString() + gameWidth.toString() + gameHeight.toString();
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
  QTable[lastState][lastAction] = QTable[lastState][lastAction] + learningRate*(reward + gamma * max - QTable[lastState][lastAction]);
  lastState = newState;
}

const ai = {
  start: start,
  takeAction: takeAction,
  updateTable: updateTable
};
