function updateLearningRate(learningRate){
  const learningRateValue = document.getElementById("learningRateValue");
  learningRateValue.innerHTML = learningRate/100;
}

function updateGammaRate(gammaRate){
  const gammaRateValue = document.getElementById("gammaRateValue");
  gammaRateValue.innerHTML = gammaRate/100;
}

function updateExploreRate(exploreRate){
  const exploreRateValue = document.getElementById("exploreRateValue");
  exploreRateValue.innerHTML = exploreRate/100;
}

function updateDecayExploreRate(decayExploreRate){
  const decayExploreRateValue = document.getElementById("decayExploreRateValue");
  decayExploreRateValue.innerHTML = decayExploreRate/100;
}

function initializeSnakeGame(gameId, scoreId) {
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
  //document.body.scrollTop = 0; // For Chrome, Safari and Opera
  //document.documentElement.scrollTop = 0; // For IE and Firefox

  SNAKE_GAME(gameId, scoreId);
}

function restartGame(gameId, scoreId){
  $(`#${gameId}`).html('');
  initializeSnakeGame(gameId, scoreId);
}

$(function() {

  $('#restart').on('click', function() {
    //window.location.reload();
    restartGame('snakeCanvas0', 'scoreCanvas0');
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
      let aiAmount = $('#AIAmount').val();
      for (let i = 0; i < aiAmount; i++){
        let gameId = `snakeCanvas${i}`;
        let scoreId = `score${i}`;
        $('#gameDiv').append(`<div class="row">
        <div class="col-sm-6 col-md-6">
          <p style="font-weight:bolder;font-size:large" id="${scoreId}">Score : </p>
        </div>
        <div class="col-sm-12 col-md-12">
          <div id="${gameId}"></div>
        </div>
      </div>`);
      initializeSnakeGame(gameId, scoreId);
      }
    }
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