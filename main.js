$(function() {

  $('#restart').on('click', function() {
    //window.location.reload();
    $('#snakeCanvas').html('');
    initializeSnakeGame();
  });

  if (Cookies.get('username')) {
    //console.log('Welcome back ' + Cookies.get('username'));
    initializeSnakeGame();
  } else {
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
  }


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
    $('#initialDiv').hide();
    $('#restart').hide();
    document.body.scrollTop = 0; // For Chrome, Safari and Opera
    document.documentElement.scrollTop = 0; // For IE and Firefox
    const SNAKE_GAME_OBJ = new p5(SNAKE_GAME.SNAKE_GAME_FUNCTION);
    ai.start();
  }
});