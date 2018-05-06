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
  lastState = snakeXPoints.join('').toString() + snakeYPoints.join('').toString() + gameWidth.toString() + gameHeight.toString();
  let max = -99999;
  if (QTable[lastState] == undefined){
    QTable[lastState] = [];
    QTable[lastState][0] = -1;
    QTable[lastState][1] = -1;
    QTable[lastState][2] = -1;
    QTable[lastState][3] = -1;
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
  let newState = snakeXPoints.join('').toString() + snakeYPoints.join('').toString() + gameWidth.toString() + gameHeight.toString();
  if (QTable[newState] == undefined){
    QTable[newState] = [];
    QTable[newState][0] = -1;
    QTable[newState][1] = -1;
    QTable[newState][2] = -1;
    QTable[newState][3] = -1;
  }
  let max = -999999;
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
