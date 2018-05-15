// Initialize canvas and required variables
var canvas = document.getElementById("canvas"),
  image = document.getElementById("desk-image"),
  ctx = canvas.getContext("2d"), // Create canvas context
  W = window.innerWidth, // Window's width
  H = window.innerHeight, // Window's height
  score1 = 0, // Player scorecard
  score2 = 0, // Computer scorecard
  ping = new Audio('pong.wav'), // Ball hitting the paddle sound
  keysDown = {}, // Capture event keys
  player = new Player(), // Assign player to right paddle
  computer = new Computer(), // Assign computer player to left paddle
  startX = 130, // Starting ball position x-axis
  startY = 210, // Starting ball position y-axis
  ball = new Ball(startX, startY); // Ball object

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
      ball.x = startX;
      ball.y = startY;
      ball.xSpeed = 4;
      ball.ySpeed = Math.floor((Math.random() * 5) + -4);
    }
  }
};

function Paddle(x, y, width, height) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.speed = 2;
};

function Computer() {
  this.paddle = new Paddle(374, 200, 6, 33);
};

function Player() {
  this.paddle = new Paddle(37, 200, 6, 33);
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
  if (this.y < 172) {
    this.y = 172;
  } else if (this.y + this.height > 332) {
    this.y = 332 - this.height;
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

  // ball hitting top and bottom
  if (this.top < 176) {
    this.y = 176;
    this.ySpeed = -this.ySpeed;
  } else if (this.bottom > 328) {
    this.y = 328;
    this.ySpeed = -this.ySpeed;
  }

  // ball hitting player paddle
  if (this.left > (paddle1.x - paddle1.width) && 
      this.left < (paddle1.x + paddle1.width) && 
     (this.top < (paddle1.y + paddle1.height) && 
      this.bottom > (paddle1.y - paddle1.height / 2))) {
    // then...
    this.xSpeed = -this.xSpeed;
    this.y > (paddle1.y + paddle1.height / 2) ? this.ySpeed += (paddle1.speed / 2) : this.ySpeed -= (paddle1.speed / 2);
    ping.play();
  }

  // ball hitting computer paddle
  if (this.right > (paddle2.x - paddle2.width) && 
      this.right < (paddle2.x + paddle2.width) && 
     (this.top < (paddle2.y + paddle2.height) && 
      this.bottom > (paddle2.y - paddle2.height / 2))) {
    // then...
    this.xSpeed = -this.xSpeed;
    this.y > (paddle2.y + paddle2.height / 2) ? this.ySpeed += (paddle2.speed / 2) : this.ySpeed -= (paddle2.speed / 2);
    ping.play();
  }

  if (this.x < 33 || this.x > 384) {
    this.x > 384 ? score1++ : score2++;
    // verify ball can get past AI paddle
    console.log("X = " + this.x + "Player: " + score1 + " Computer: " + score2);
    this.x = startX;
    this.y = startY;
    this.xSpeed = 3;
    this.ySpeed = Math.floor((Math.random() * 6) + -4);
  }
};

// Function to paint canvas
var paintCanvas = function() {
  // Game image
  ctx.drawImage(image, 0, 0);
  // Gameboard
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.moveTo(15, 139);
  ctx.lineTo(394, 161);
  ctx.lineTo(390, 343);
  ctx.lineTo(25, 358);
  ctx.fill();
  // Net line
  ctx.setLineDash([3, 9]);
  ctx.lineWidth = "10";
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(208, 166);
  ctx.lineTo(208, 338);
  ctx.stroke();
  // Scoreboard
  ctx.fillStyle = "grey";
  ctx.beginPath();
  ctx.moveTo(419, 162);
  ctx.lineTo(772, 150);
  ctx.lineTo(767, 350);
  ctx.lineTo(419, 340);
  ctx.fill();
  // Label
  ctx.fillStyle = "blue";
  ctx.font = "30px Arial";
  ctx.fillText("SCORE CARD", 480, 190);
  // Underline
  ctx.setLineDash([]);
  ctx.lineWidth = "1";
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(480, 192);
  ctx.lineTo(680, 192);
  ctx.stroke();
  // Score line divider
  ctx.setLineDash([]);
  ctx.lineWidth = "2";
  ctx.strokeStyle = "blue";
  ctx.beginPath();
  ctx.moveTo(580, 192);
  ctx.lineTo(580, 325);
  ctx.stroke();
  // Player 1 label & score
  ctx.fillStyle = "orange";
  ctx.font = "20px Comic Sans MS";
  ctx.fillText("Avenger", 485, 210);
  ctx.font = "50px Arial";
  ctx.fillText(score1, 500, 270);
  // Computer player label & score
  ctx.fillStyle = "orange";
  ctx.font = "20px Comic Sans MS";
  ctx.fillText("J.A.R.V.I.S.", 585, 210);
  ctx.font = "50px Arial";
  ctx.fillText(score2, 625, 270);
  // Pong table
  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.lineWidth="10";
  ctx.strokeStyle="grey";
  ctx.rect(31, 166, 355, 172);
  ctx.stroke(); 
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
