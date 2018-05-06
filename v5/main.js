function updateLearningRate(learningRate){
  const learningRateValue = document.getElementById("learningRateValue");
  learningRateValue.innerHTML = learningRate/100;
}

function updateGammaRate(gammaRate){
  const gammaRateValue = document.getElementById("gammaRateValue");
  gammaRateValue.innerHTML = gammaRate/100;
}

function updateExploitRate(exploitRate){
  const exploitRateValue = document.getElementById("exploitRateValue");
  exploitRateValue.innerHTML = exploitRate/100;
}

function updateDecayExploitRate(decayExploitRate){
  const decayExploitRateValue = document.getElementById("decayExploitRateValue");
  decayExploitRateValue.innerHTML = decayExploitRate/100;
}

$(function() {

  $('#restart').on('click', function() {
    //window.location.reload();
    $('#snakeCanvas').html('');
    initializeSnakeGame();
  });

  $('#gameDiv').hide();
  $('#playerName').focus();

  $(document).on('keypress', function(event) {
    if (event.keyCode === 13) {
      setupGame();
    }
  });

  $('#startGame').on('click', function() {
    setupGame();
  });

  /**if (Cookies.get('username')) {
    //console.log('Welcome back ' + Cookies.get('username'));
    initializeSnakeGame();
  } **/

  function setupGame() {
    const playerName = $('#playerName').val();
    if (playerName.length < 1 ||
      playerName.length > 10) {
      $('#error').html('1-10 characters only please');
    } else {
      Cookies.set('username', playerName);
      $('#gameDiv').show();
      $(document).unbind('keypress');
      initializeSnakeGame();
    }
  }

  function initializeSnakeGame() {
    let width = $('#width').val();
    let height = $('#height').val();
    let speed = $('#speed').val();

    if ((width <= 0 || !isInt(width)) || (height <= 0 || !isInt(height)) || (speed <= 0 || !isInt(speed))){
      $('#error').html('Width, height and speed must be positive numbers');
      return;
    }
    $('#initialDiv').hide();
    $('#AIDivLabels').hide();
    $('#AIDivValues').hide();
    $('#canvasDiv').hide();
    $('#restart').hide();
    document.body.scrollTop = 0; // For Chrome, Safari and Opera
    document.documentElement.scrollTop = 0; // For IE and Firefox
    const SNAKE_GAME_OBJ = new p5(SNAKE_GAME.SNAKE_GAME_FUNCTION);
    ai.start();
  }
});

function isInt(value) {
  if (isNaN(value)) {
    return false;
  }
  var x = parseFloat(value);
  return (x | 0) === x;
}