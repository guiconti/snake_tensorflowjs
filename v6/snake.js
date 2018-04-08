const SNAKE_GAME = (function () {

  const SNAKE_GAME_FUNCTION = function(snake) {

    const PARENT_WIDTH = $('#snakeCanvas').parent().width();
    const WINDOW_HEIGHT = window.innerHeight;

    const MAX_GAME_SIZE = $('#width').val();

    let canvasWidth = PARENT_WIDTH > MAX_GAME_SIZE && WINDOW_HEIGHT - 100 > MAX_GAME_SIZE ? MAX_GAME_SIZE : PARENT_WIDTH > WINDOW_HEIGHT - 100 ? WINDOW_HEIGHT - 100 : PARENT_WIDTH - 40;
    let canvasHeight = $('#height').val();

    // the snake is divided into small segments, which are drawn and edited on each 'draw' call
    let numSegments = 3;
    let direction = 'right';
    const PIXELS_PER_SQUARE = 10;
    const SNAKE_XSTART = 0; //starting x coordinate for snake
    const SNAKE_YSTART = Math.floor(canvasWidth / 20) * PIXELS_PER_SQUARE; //starting y coordinate for snake

    let frameRate = parseInt($('#speed').val());
    let directionsQueue = [];

    const X_COR = [];
    const Y_COR = [];

    let xFruit = 0;
    let yFruit = 0;
    const SCORE = $('#score');

    snake.setup = function() {
      const CANVAS = snake.createCanvas(canvasWidth, canvasHeight);
      CANVAS.parent('snakeCanvas');
      snake.frameRate(frameRate);
      snake.background(0);
      snake.stroke(255);
      snake.strokeWeight(6);
      SCORE.html('Score : ' + 0);

      if (window.innerWidth >= MAX_GAME_SIZE) {
        $('#controls').hide();
      }

      initializeControls();
      updateFruitCoordinates();

      for (let i = 0; i < numSegments; i++) {
        X_COR.push(SNAKE_XSTART + (i * PIXELS_PER_SQUARE));
        Y_COR.push(SNAKE_YSTART);
      }

    };

    snake.draw = function() {
      snake.background(0);

      for (let i = 0; i < numSegments - 1; i++) {
        snake.line(X_COR[i], Y_COR[i], X_COR[i + 1], Y_COR[i + 1]);
      }

      //  TODO: AI should be independent from the game
      ai.generateState(X_COR, Y_COR, direction, xFruit, yFruit, snake.width, snake.height, PIXELS_PER_SQUARE);
      directionsQueue.push(ai.takeAction());
      handleDirection();
      updateSnakeCoordinates();
      checkGameStatus();
      checkForFruit();
    };

    /*
    I store the directions in a queue, and pop them once every
    time the 'draw' function is called. This way the snake always
    has one unique direction to head towards (in case the user presses
    2 direction keys at the same time)
    */
    function handleDirection() {
      if (directionsQueue.length > 0) {
        const DIRECTION = directionsQueue.shift();
        switch (DIRECTION) {
          case 'left':
            if (direction != 'right') {
              direction = 'left';
            }
            break;
          case 'right':
            if (direction != 'left') {
              direction = 'right';
            }
            break;
          case 'up':
            if (direction != 'down') {
              direction = 'up';
            }
            break;
          case 'down':
            if (direction != 'up') {
              direction = 'down';
            }
            break;
        }
      }
    }

    /*
     The snake segments are updated based on the direction of the snake.
     All segments from 0 to n-1 are just copied over to 1 till n, i.e. segment 0
     gets the value of segment 1, segment 1 gets the value of segment 2, and so on,
     and this results in the movement of the snake.
     The last segment is added based on the direction in which the snake is going,
     if it's going left or right, the last segment's x coordinate is increased by a
     predefined value 'PIXELS_PER_SQUARE' than its second to last segment. And if it's going up
     or down, the segment's y coordinate is affected.
    */
    function updateSnakeCoordinates() {

      for (let i = 0; i < numSegments - 1; i++) {
        X_COR[i] = X_COR[i + 1];
        Y_COR[i] = Y_COR[i + 1];
      }
      switch (direction) {
        case 'right':
          X_COR[numSegments - 1] = X_COR[numSegments - 2] + PIXELS_PER_SQUARE;
          Y_COR[numSegments - 1] = Y_COR[numSegments - 2];
          break;
        case 'up':
          X_COR[numSegments - 1] = X_COR[numSegments - 2];
          Y_COR[numSegments - 1] = Y_COR[numSegments - 2] - PIXELS_PER_SQUARE;
          break;
        case 'left':
          X_COR[numSegments - 1] = X_COR[numSegments - 2] - PIXELS_PER_SQUARE;
          Y_COR[numSegments - 1] = Y_COR[numSegments - 2];
          break;
        case 'down':
          X_COR[numSegments - 1] = X_COR[numSegments - 2];
          Y_COR[numSegments - 1] = Y_COR[numSegments - 2] + PIXELS_PER_SQUARE;
          break;
      }
    }

    /*
     I always check the snake's head position X_COR[X_COR.length - 1] and
     Y_COR[Y_COR.length - 1] to see if it touches the game's boundaries
     or if the snake hits itself.
    */
    function checkGameStatus() {
      if (X_COR[X_COR.length - 1] > snake.width ||
        X_COR[X_COR.length - 1] < 0 ||
        Y_COR[Y_COR.length - 1] > snake.height ||
        Y_COR[Y_COR.length - 1] < 0 ||
        checkSnakeCollision()) {
        ai.generateState(X_COR, Y_COR, direction, xFruit, yFruit, snake.width, snake.height, PIXELS_PER_SQUARE, true);
        ai.updateTable(Number.MIN_SAFE_INTEGER);
        snake.noLoop();
        const SCORE_VAL = SCORE.html().substring(8);
        /**SNAKE_GAME_SOCKET.emit('result', {
          name: Cookies.get('username'),
          val: SCORE_VAL
        });
        **/
        SCORE.html('Game ended! Score : ' + SCORE_VAL);
        $('#restart').show();
        $('#restart').click();
      }
    }

    /*
     If the snake hits itself, that means the snake head's (x,y) coordinate
     has to be the same as one of its own segment's (x,y) coordinate.
    */
    function checkSnakeCollision() {
      const SNAKE_HEAD_X = X_COR[X_COR.length - 1];
      const SNAKE_HEAD_Y = Y_COR[Y_COR.length - 1];
      for (let i = 0; i < X_COR.length - 1; i++) {
        if (X_COR[i] === SNAKE_HEAD_X && Y_COR[i] === SNAKE_HEAD_Y) {
          return true;
        }
      }
    }

    /*
     Whenever the snake consumes a fruit, I increment the number of segments,
     and just insert the tail segment again at the start of the array (basically
     I add the last segment again at the tail, thereby extending the tail)
    */
    function checkForFruit() {
      snake.point(xFruit, yFruit);
      if (X_COR[X_COR.length - 1] === xFruit && Y_COR[Y_COR.length - 1] === yFruit) {
        const PREV_SCORE = parseInt(SCORE.html().substring(8));
        SCORE.html('Score : ' + (PREV_SCORE + 1));
        X_COR.unshift(X_COR[0]);
        Y_COR.unshift(Y_COR[0]);
        numSegments++;
        snake.setFrameRate(frameRate++);
        updateFruitCoordinates();
        ai.generateState(X_COR, Y_COR, direction, xFruit, yFruit, snake.width, snake.height, PIXELS_PER_SQUARE, true);
        ai.updateTable(100);
      } else {
        ai.generateState(X_COR, Y_COR, direction, xFruit, yFruit, snake.width, snake.height, PIXELS_PER_SQUARE, true);
        ai.updateTable(-1);
      }
    }

    function updateFruitCoordinates() {
      /*
        The complex math logic is because I wanted the point to lie
        in between 100 and width-100, and be rounded off to the nearest
        number divisible by 10, since I move the snake in multiples of 10.
      */
      xFruit = snake.floor(snake.random(PIXELS_PER_SQUARE, snake.width / PIXELS_PER_SQUARE)) * PIXELS_PER_SQUARE;
      yFruit = snake.floor(snake.random(PIXELS_PER_SQUARE, snake.height / PIXELS_PER_SQUARE)) * PIXELS_PER_SQUARE;
      console.log("x - " + xFruit);
      console.log("y - " + yFruit);
    }

    function initializeControls() {
      $('#ctrlClck').on('click', function() {
        switch (direction) {
          case 'right':
            direction = 'down';
            break;
          case 'up':
            direction = 'right';
            break;
          case 'left':
            direction = 'up';
            break;
          case 'down':
            direction = 'left';
            break;
        }
      });

      $('#ctrlCntrClck').on('click', function() {
        switch (direction) {
          case 'right':
            direction = 'up';
            break;
          case 'up':
            direction = 'left';
            break;
          case 'left':
            direction = 'down';
            break;
          case 'down':
            direction = 'right';
            break;
        }
      });
    }

    snake.keyPressed = function() {
      switch (snake.keyCode) {
        case snake.LEFT_ARROW:
          directionsQueue.push('left');
          //console.log('adding left');
          break;
        case snake.RIGHT_ARROW:
          directionsQueue.push('right');
          //console.log('adding right');
          break;
        case snake.UP_ARROW:
          directionsQueue.push('up');
          //console.log('adding up');
          break;
        case snake.DOWN_ARROW:
          directionsQueue.push('down');
          //console.log('adding down');
          break;
      }
    };
  };

  return {
    SNAKE_GAME_FUNCTION
  };

})();