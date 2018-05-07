// RequestAnimFrame: a browser API for getting smooth animations
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60) };

// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
  image = document.getElementById("desk-image"),
  ctx = canvas.getContext("2d"), // Create canvas context

  W = window.innerWidth, // Window's width
  H = window.innerHeight, // Window's height

  player = new Player(), //Assign player to right paddle
  computer = new Computer(), //Assign computer player to left paddle
  ball = new Ball(150, 230); // Ball object

var update = function () {
  player.update();
  computer.update();
};

var render = function () {
  paintCanvas();
  player.render();
  computer.render();
  ball.render();
}

var step = function () {
  update();
  render();
  animate(step);
};

window.onload = function () {
  document.body.appendChild(canvas);
  paintCanvas();
  animate(step);
};

//Paddles
function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.x_speed = 0;
  this.y_speed = 0;
}

Paddle.prototype.render = function () {
  ctx.fillStyle = "lime";
  ctx.fillRect(this.x, this.y, this.width, this.height);

};

function Player() {
  this.paddle = new Paddle(72, 150, 4, 30);
}

Player.prototype.render = function () {
  this.paddle.render();
};

Paddle.prototype.move = function (y) {
  this.y += y;
  this.y_speed = y;
  if (this.y < 139) {
    this.y = 139;
    this.y_speed = 139;
  } else if (this.y + this.height > 329) {
    this.y = 329 - this.height;
    this.y_speed = 0;
  }
}

Player.prototype.update = function () {
  for (var key in keysDown) {
    var value = Number(key);
    if (value == 40) {
      this.paddle.move(4);
    } else if (value == 38) {
      this.paddle.move(-4);
    } else {
      this.paddle.move(0);
    }
  }
};

//Ball
function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.x_speed = 5;
  this.y_speed = 0;
  this.radius = 5;
}

Ball.prototype.render = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fillStyle = "orange";
  ctx.fill();
};

//Computer ai
function Computer() {
  this.paddle = new Paddle(366, 200, 4, 30);
}

Computer.prototype.render = function () {
  this.paddle.render();
};

function randomOffset(min, max) {
  return (Math.random() * (max - min)) + min;
}

Computer.prototype.update = function () {
  var DIFFICULTY = 0.2;
  var ball_y_position = ball.y;
  // difference between ball y and the paddle y
  var diff = ((this.paddle.y + (this.paddle.height / 2)) - ball_y_position);
  if (diff < 0) {
    diff = 3;
  }
  else if (diff > 0) {
    diff = -3;
  }

  if (ball.x + ball.y != 380) {
    // sets the difficulty, an offset between these two numbers
    this.paddle.move(diff * randomOffset(DIFFICULTY, 1));
  }
  
  if (this.paddle.y < 134) {
    this.paddle.y = 780;
  }
  else if (this.paddle.y + this.paddle.height > 311) {
    this.paddle.y = 311 - this.paddle.height;
  }
}

// Function to paint canvas
var paintCanvas = function() {
  // Game image
  ctx.drawImage(image, 0, 0);
  // Gameboard
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(49, 138);
  ctx.lineTo(381, 133);
  ctx.lineTo(388, 312);
  ctx.lineTo(62, 330);
  ctx.fill();
  // Net line
  ctx.setLineDash([3, 9]);
  ctx.beginPath();
  ctx.moveTo(225, 138);
  ctx.lineTo(235, 321);
  ctx.strokeStyle = "grey";
  ctx.stroke();
  // Scoreboard
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.moveTo(403, 132);
  ctx.lineTo(735, 119);
  ctx.lineTo(734, 309);
  ctx.lineTo(406, 310);
  ctx.fill();
}  

// Function for running the whole animation
function animation() {
  init = requestAnimFrame(animation);
  paintCanvas();
}

// Even listener
var keysDown = {};
window.addEventListener("keydown", function (event) {
  keysDown[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
  delete keysDown[event.keyCode];
});
