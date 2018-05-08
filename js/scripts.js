// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
  image = document.getElementById("desk-image"),
  ctx = canvas.getContext("2d"), // Create canvas context
  W = window.innerWidth, // Window's width
  H = window.innerHeight, // Window's height
  keysDown = {},
  player = new Player(), //Assign player to right paddle
  computer = new Computer(), //Assign computer player to left paddle
  ball = new Ball(150, 230); // Ball object

var render = function () {
  paintCanvas();
  player.render();
  computer.render();
  ball.render();
};

// RequestAnimFrame: a browser API for getting smooth animations
var animate = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function (callback) { window.setTimeout(callback, 1000 / 60) }; 

var step = function () {
  update();
  render();
  animate(step);
};

var update = function () {
  gameState();
  player.update();
  computer.update();
  ball.update(player.paddle, computer.paddle);
};

function gameState() {
  for (var key in keysDown) {
    var value = Number(key);
    if (value == 13) { //Enter
      ball.x = 400;
      ball.y = 300;
      ball.xSpeed = 3;
      ball.ySpeed = Math.floor((Math.random() * 8) + -4);
    }
  }
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = 4;
};

function Computer() {
  this.paddle = new Paddle(370, 200, 4, 30);
};

function Player() {
  this.paddle = new Paddle(68, 150, 4, 30);
};

function Ball(x, y) {
  this.x = x;
  this.y = y;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.radius = 5;
};

Paddle.prototype.render = function () {
  ctx.fillStyle = "lime";
  ctx.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move = function (x, y) {
  this.x += x;
  this.y += y;
  if (this.y < 139) {
    this.y = 139;
  } else if (this.y + this.height > 329) {
    this.y = 329 - this.height;
  }
};

Player.prototype.update = function () {
  for (var key in keysDown) {
    var value = Number(key);
    if (value == 38) { // Up Arrow
      this.paddle.move(0, -this.paddle.speed);
    } else if (value == 40) { // Down Arrow
      this.paddle.move(0, this.paddle.speed);
    } else {
      this.paddle.move(0, 0);
    }
  }
};

Computer.prototype.update = function () {
  (this.paddle.y + this.paddle.height / 2) > ball.y ? this.paddle.move(0, -this.paddle.speed) : this.paddle.move(0, 0);
  (this.paddle.y + this.paddle.height / 2) < ball.y ? this.paddle.move(0, this.paddle.speed) : this.paddle.move(0, 0);
};

Player.prototype.render = function () {
  this.paddle.render();
};

Computer.prototype.render = function () {
  this.paddle.render();
};

Ball.prototype.render = function () {
  ctx.beginPath();
  ctx.fillStyle = "orange";
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fill();
};

Ball.prototype.update = function (paddle1, paddle2) {
  this.x += this.xSpeed;
  this.y += this.ySpeed;
  this.right = this.x + 4;
  this.left = this.x - 4;
  this.top = this.y + 4;
  this.bottom = this.y - 4;

  if (this.top < 133) {
    this.y = 133;
    this.ySpeed = -this.ySpeed;
  } else if (this.bottom > 312) {
    this.y = 312;
    this.ySpeed = -this.ySpeed;
  }

  if (this.left > (paddle1.x - paddle1.width) && 
      this.left < (paddle1.x + paddle1.width) && 
     (this.top < (paddle1.y + paddle1.height) && 
      this.bottom > (paddle1.y - paddle1.height / 2))) {
    // then...
    this.xSpeed = -this.xSpeed;
    this.y > (paddle1.y + paddle1.height / 2) ? this.ySpeed += (paddle1.speed / 2) : this.ySpeed -= (paddle1.speed / 2);
  }

  if (this.right > (paddle2.x - paddle2.width) && 
      this.right < (paddle2.x + paddle2.width) && 
     (this.top < (paddle2.y + paddle2.height) && 
      this.bottom > (paddle2.y - paddle2.height / 2))) {
    // then...
    this.xSpeed = -this.xSpeed;
    this.y > (paddle2.y + paddle2.height / 2) ? this.ySpeed += (paddle2.speed / 2) : this.ySpeed -= (paddle2.speed / 2);
  }

  if (this.x < 39 || this.x > 380) {
    this.x = 150;
    this.y = 230;
    this.xSpeed = 3;
    this.ySpeed = Math.floor((Math.random() * 8) + -4);
  }
};

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
};  

// Start of program ***HERE***
window.onload = function () {
  document.body.appendChild(canvas);
  paintCanvas();
  animate(step);
};

// Event listener
window.addEventListener("keydown", function (event) {
  keysDown[event.keyCode] = true;
});
window.addEventListener("keyup", function (event) {
  delete keysDown[event.keyCode];
});
