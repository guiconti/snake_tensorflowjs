const AMOUNT_OF_ACTIONS = 4;
const AMOUNT_OF_STATES = 7;
const UP = 0;
const LEFT = 1;
const RIGHT = 2;
const DOWN = 3;

let action;

let QTable = [];
let rewardList = [];
let learningRate = .8;
let futureSignificancy = .95;
let probabilityToExplore = .1;
let exploreDecay = .1;

let newState;
let lastState;
let lastAction;

const directions = {
  'up': '0',
  'left': '1',
  'right': '2',
  'down': '3'
};

function start(){
  learningRate = $('#learningRate').val()/100;
  futureSignificancy = $('#gammaRate').val()/100;
  probabilityToExplore = $('#exploreRate').val()/100;
  exploreDecay = $('#decayExploreRate').val()/100;
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
  if (Math.random() > probabilityToExplore){
    QTable[lastState].forEach((possibleReward, possibleAction) => {
      if (possibleReward > max){
        lastAction = possibleAction;
        max = possibleReward
      }
    });
  } else {
    probabilityToExplore = probabilityToExplore - (probabilityToExplore * exploreDecay);
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

function generateState(snakeXPoints, snakeYPoints, direction, xFruit, yFruit, gameWidth, gameHeight, pixelsPerSquare, isReward = false){

  let state = '0'.repeat(AMOUNT_OF_STATES).split('');

  let snakeHeadX = snakeXPoints[snakeXPoints.length - 1];
  let snakeHeadY = snakeYPoints[snakeYPoints.length - 1];

  if (snakeHeadX == 0)
    state[0] = '1';
  if (snakeHeadY == 0)
    state[1] = '1';
  if (snakeHeadX == gameWidth/pixelsPerSquare)
    state[2] = '1';
  if (snakeHeadY == gameHeight/pixelsPerSquare)
    state[3] = '1';

  snakeXPoints.forEach(snakeXPoint => {
    if (snakeXPoint == snakeHeadX - 1)
      state[0] = '1';
    if (snakeXPoint == snakeHeadX + 1)
      state[2] = '1';
  });

  snakeYPoints.forEach(snakeYPoint => {
    if (snakeYPoint == snakeHeadY - 1)
      state[1] = '1';
    if (snakeYPoint == snakeHeadY + 1)
      state[3] = '1';
  });

  if (snakeHeadX == xFruit)
    state[4] = '0';
  else if (snakeHeadX > xFruit)
    state[4] = '1';
  else 
    state[4] = '2';

  if (snakeHeadY == yFruit)
    state[5] = '0';
  else if (snakeHeadY > yFruit)
    state[5] = '1';
  else 
    state[5] = '2';

  state[6] = directions[direction];

  if (isReward)
    newState = state.join('');
  else
    lastState = state.join('');

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
