const AMOUNT_OF_ACTIONS = 4;
const UP = 0;
const LEFT = 1;
const RIGHT = 2;
const DOWN = 3;

let action;

function start(){
  console.log('AI Started');
}

function takeAction(){
  switch(Math.floor(Math.random() * Math.floor(AMOUNT_OF_ACTIONS))){
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

const ai = {
  start: start,
  takeAction: takeAction
};
