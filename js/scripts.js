// Initialize variables
var paddleLeft;
var paddleRight;
var screenLeft;
var screenRight;
var direction;
var ball;

// Fired off from HTML <body> tag
function startGame() {
  myGameArea.start();
  myGameArea.room();
  screenLeft = new screenPosition("left");
  screenRight = new screenPosition("right");
  paddleLeft = new gamePart(4, 30, "lime", 80, 150);
  paddleRight = new gamePart(4, 30, "lime", 360, 200);
  ball = new gamePart(7, 7, "orange", 200, 170);
} // end startGame

// called from myGameArea setInterval function
function updateGameArea() {
  myGameArea.clear();
  myGameArea.room();
  screenLeft.screenUpdate();
  screenRight.screenUpdate();
  paddleLeft.gameUpdate();
  paddleRight.gameUpdate();
  ball.gameUpdate();
} // end updateGameArea

// Set up canvas and game room
var myGameArea = {
  canvas: document.createElement("canvas"),
  image: document.getElementById("desk-image"),
  start: function () {
    this.canvas.width = 800;
    this.canvas.height = 500;
    this.ctx = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 20);
  },

  room: function () {
    this.ctx.drawImage(this.image, 0, 0);
  },

  clear: function () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
} //end myGameArea

// Static drawing of screens and the net
function screenPosition(direction) {
  this.direction = direction;
  this.screenUpdate = function () {
    ctx = myGameArea.ctx;
    switch (this.direction) {
      case "left":
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
        break;
      case "right":
        // Scoreboard
        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.moveTo(403, 132);
        ctx.lineTo(735, 119);
        ctx.lineTo(734, 309);
        ctx.lineTo(406, 310);
        ctx.fill();
        break;
      default:
        console.log("Screen position error");
        break;
    }
  }
} //end screenPosition

// Constructor function for creating game parts
function gamePart(width, height, color, x, y) {
  this.width = width;
  this.height = height;
  this.color = color;
  this.x = x;
  this.y = y;
  this.gameUpdate = function () {
    ctx = myGameArea.ctx;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
} // end gamePart