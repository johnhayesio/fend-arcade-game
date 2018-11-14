// Define variables
var gameScore = document.getElementById('gameDisplay');
var showCongrats = document.getElementById('congratsPopup');
var replay = document.getElementById('congratsPlay');

// Play again reset
replay.addEventListener('click', function () {
  showCongrats.className = 'hide';
  tracker.reset();
  gem.reset();
  allObstacles.forEach(function (obstacle) {
    obstacle.reset();
  });
  clearMessage();
});

// Avoid enemies
var Enemy = function () {
  this.sprite = 'images/enemy-bug.png';
  this.w = 90;
  this.h = 63;
  this.reset();
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
  if (this.x < 606) {
    this.x += dt * this.speed;
  } else {
    this.reset();
  }
};

// Update position
Enemy.prototype.update = function(dt) {
    if (this.x < 606){
        this.x += dt * this.speed;
    }else {
        this.reset();
    }
};

// Reset position and speed
Enemy.prototype.reset = function(){
    var X1 = 75;
    var X2 = 500;
    this.x = -(Math.floor(Math.random() * (X2 - X1) + X1));

    // Select row
    var row = Math.floor((Math.random() * 3) + 1);

    // Center
    this.y = row * 83 - 40;

    // Pick a median number
    var fast = 200;
    var slow = 75;
    this.speed = Math.floor(Math.random() * (fast - slow) + slow);
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
  this.sprite = 'images/char-boy.png';
  this.w = 50;
  this.h = 70;
  this.x = '';
  this.y = '';
  this.tile = '';
  this.reset();
};

// Set player location
Player.prototype.reset = function(){
    this.x = 202;
    this.y = 375;
    this.tile = xyTileNum(this.x, this.y);
};

// Give bonus if won
Player.prototype.update = function(){
    // Track won
    if ((this.y < 10) && (tracker.won === false)){
        tracker.won = true;
        // Wait .5s
        setTimeout(function(){ return showPopup();}, 500);
        setTimeout(function(){ return this.reset();}.bind(this), 500);
        setTimeout(function(){ return tracker.addScore(100);}, 500);
    }
};

// Draw player
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Arrow keys input
Player.prototype.handleInput = function (e) {
  // Clear status messages after move
  clearMessage();
  // Lock canvas movement
  switch (e) {
    case ('left'):
      if (this.x > 0) {
        this.x -= 101;
        this.tile = xyTileNum(this.x, this.y);
        // If obstacle, undo
        if (tracker.hasObstacle(this.tile)) {
          this.x += 101;
          this.tile = xyTileNum(this.x, this.y);
        }
      }
      break;
    case ('right'):
      if (this.x < 404) {
        this.x += 101;
        this.tile = xyTileNum(this.x, this.y);
        // If obstacle, undo
        if (tracker.hasObstacle(this.tile)) {
          this.x -= 101;
          this.tile = xyTileNum(this.x, this.y);
        }
      }
      break;
    case ('up'):
      if (this.y > 0) {
        this.y -= 83;
        this.tile = xyTileNum(this.x, this.y);
        // If obstacle, undo
        if (tracker.hasObstacle(this.tile)) {
          this.y += 83;
          this.tile = xyTileNum(this.x, this.y);
        }
      }
      break;
    case ('down'):
      if (this.y < 332) {
        this.y += 83;
        this.tile = xyTileNum(this.x, this.y);
        // If obstacle, undo
        if (tracker.hasObstacle(this.tile)) {
          this.y -= 83;
          this.tile = xyTileNum(this.x, this.y);
        }
      }
      break;
  } //end switch

  if (tracker.hasGem(this.tile)) {
    tracker.addScore(25);
    gem.reset();
  }
};

// Obstacle class
var Obstacle = function () {
  this.sprite = 'images/Rock.png';
  this.reset();
};

// Draw obstacle
Obstacle.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Change obstacle position
Obstacle.prototype.reset = function () {
  // Select column
  var col = Math.floor(Math.random() * 5);
  this.x = col * 101;
  // Center
  this.y = 292;
  this.tile = xyTileNum(this.x, this.y);
  tracker.setTileObstacleTrue(this.tile);
};

// Track obstacle location and set new trackers to false
var Tracker = function () {
  this.obstacleTiles = [];
  this.gemTiles = [];
  this.numTiles = 30;
  this.score = '';
  this.won = false;
  this.reset();
};

// Reset all tiles, won, and score
Tracker.prototype.reset = function () {
  this.setAllObstacleFalse();
  this.setAllGemFalse();
  this.resetScore();
  this.won = false;
};

Tracker.prototype.setAllObstacleFalse = function () {
  for (var i = 0; i < this.numTiles; i++) {
    this.obstacleTiles[i] = false;
  }
};

Tracker.prototype.setAllGemFalse = function () {
  for (var i = 0; i < this.numTiles; i++) {
    this.gemTiles[i] = false;
  }
};

Tracker.prototype.resetScore = function () {
  this.score = 0;
  gameScore.innerHTML = 'Score: ' + this.score;
};

// Set tile number true
Tracker.prototype.setTileObstacleTrue = function (tileNum) {
  this.obstacleTiles[tileNum] = true;
};

// Set tile number true
Tracker.prototype.setTileGemTrue = function (tileNum) {
  this.gemTiles[tileNum] = true;
};

// Return true or false
Tracker.prototype.hasObstacle = function (tileNum) {
  return this.obstacleTiles[tileNum];
};

// Return true or false
Tracker.prototype.hasGem = function (tileNum) {
  return this.gemTiles[tileNum];
};

Tracker.prototype.addScore = function (points) {
  this.score += points;
  gameScore.innerHTML = 'Score: ' + this.score;
};

// Gem class
var Gem = function () {
  this.x = this.y = this.tile = this.sprite = '';
  this.reset();
};

// Draw gem
Gem.prototype.render = function () {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Reset gem
Gem.prototype.reset = function () {
  var oldTile = this.tile;
  var randomSprite = Math.floor((Math.random() * 3) + 1);
  switch (randomSprite) {
    case (1):
      this.sprite = 'images/Gem Blue.png';
      break;
    case (2):
      this.sprite = 'images/Gem Green.png';
      break;
    case (3):
      this.sprite = 'images/Gem Orange.png';
      break;
  }

  // Pick random tile and re-pick if same
  do {
    // Select a column
    var col = Math.floor(Math.random() * 5);
    this.x = col * 101;

    // Select row
    var row = Math.floor((Math.random() * 3) + 1);

    // Center gem
    this.y = row * 83 - 40;

    this.tile = xyTileNum(this.x, this.y);
  } while (oldTile == this.tile);

  tracker.setAllGemFalse();
  tracker.setTileGemTrue(this.tile);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var numOfEnemies = 5;
for (var i = 0; i < numOfEnemies; i++) {
  allEnemies[i] = new Enemy();
}

// Create tracker first
var tracker = new Tracker();
var gem = new Gem();
var allObstacles = [];
for (var j = 0; j < 3; j++) {
  allObstacles[j] = new Obstacle();
}
var player = new Player();

// Convert x, y parameters and return a tile number.
function xyTileNum(x, y) {
  var col = x / 101;
  var row = (y + 40) / 83;
  var tile = row * 5 + col;
  return tile;
}

// Clear messages
function clearMessage() {
  ctx.clearRect(0, 0, 505, 50);
}

// Display congrats
function showPopup() {
  showCongrats.className = 'show';
}

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});