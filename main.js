var canvas, context;
var cells = [];
var Cell = function() {
  this.isBomb = false;
  this.isFlagged = false;
  this.nearbyBombs = 0;
  this.isVisible = false;
}
const CELL_WIDTH = 40;
const CELL_HEIGHT = 40;
const CELL_GAP = 2;
var cellCols;
var cellRows;
var cellsLeft = 0;
var bombs = 10;
var bombsLeft = bombs;
var mouseX, mouseY;
var flagImg = document.createElement('img');
var framesPerSecond = 30;
var gameOver = false;

var reset = () => {
  cellsLeft = 0;
  bombsLeft = bombs;
  var bombCounter = 0;

  // Zero out the grid
  // Clears the grid
  for(i = 0; i < cellRows * cellRows; i++) {
    cells[i].isBomb = false;
    cells[i].isVisible = false;
    cells[i].isFlagged = false;
    cells[i].nearbyBombs = 0;
  }

  // Set Bombs in grid randomly
  // The while loop is in case the number of bombs required where not set
  while(bombCounter != bombsLeft) {
    for(i = 0; i < cellRows * cellRows; i++) {
      if (Math.random() < 0.1) {
        bombCounter++;
        cells[i].isBomb = true;
      }
      if (bombCounter === bombsLeft) {
        break;
      }
    }
  }
  for (i = 0; i < cellRows * cellCols; i++) {
    if (isAtACorner(i)) {
      if (i === 0) { // top left corner
        if (cells[i + 1].isBomb) { // To its right
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols].isBomb) { // Below it
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols + 1].isBomb) {// Bottom Right Corner
          cells[i].nearbyBombs++;
        }
      }
      else if (i === cellCols * cellRows - 1) {  // bottom right corner
        if (cells[i - 1].isBomb) { // To its left
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols].isBomb) { // Above it
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols - 1].isBomb) {// Top Left Corner
          cells[i].nearbyBombs++;
        }
      }
      else if (i === cellRows * cellCols - cellCols) { // bottom left corner
        if (cells[i + 1].isBomb) { // To its Right
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols].isBomb) { // Above it
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols + 1].isBomb) {// Top right Corner
          cells[i].nearbyBombs++;
        }
      }
      else if (i === cellCols - 1) { // top right corner
        if (cells[i - 1].isBomb) { // To its left
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols].isBomb) { // Below it
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols - 1].isBomb) {// Bottom Left Corner
          cells[i].nearbyBombs++;
        }
      }
    }
    else if (isAtTheSide(i)) {
      if (i % cellCols === cellCols - 1) { // left side
        if (cells[i - 1].isBomb) { // To its left
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols].isBomb) { // above it
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols].isBomb) { // Below it
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols - 1].isBomb) {// Bottom Left Corner
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols - 1].isBomb) {// Top Left Corner
          cells[i].nearbyBombs++;
        }
      }
      else if (i % cellCols === 0) { // right side
        if (cells[i + 1].isBomb) { // To its right
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols].isBomb) { // Above it
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols].isBomb) { // Below it
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols + 1].isBomb) {// Top right Corner
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols + 1].isBomb) {// Bottom Right Corner
          cells[i].nearbyBombs++;
        }
      }
      else if (i < cellCols) { // upper side
        if (cells[i - 1].isBomb) { // To its left
          cells[i].nearbyBombs++;
        }
        if (cells[i + 1].isBomb) { // To its right
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols].isBomb) { // Below it
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols - 1].isBomb) {// Bottom Left Corner
          cells[i].nearbyBombs++;
        }
        if (cells[i + cellCols + 1].isBomb) {// Bottom Right Corner
          cells[i].nearbyBombs++;
        }
      }
      else if (i > cellRows * cellCols - cellCols) { // Lower Side
        if (cells[i - 1].isBomb) { // To its left
          cells[i].nearbyBombs++;
        }
        if (cells[i + 1].isBomb) { // To its right
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols].isBomb) { // Above it
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols - 1].isBomb) {// Top Left Corner
          cells[i].nearbyBombs++;
        }
        if (cells[i - cellCols + 1].isBomb) {// Top right Corner
          cells[i].nearbyBombs++;
        }
      }
    }
    else {
      if (cells[i - 1].isBomb) { // To its left
        cells[i].nearbyBombs++;
      }
      if (cells[i + 1].isBomb) { // To its right
        cells[i].nearbyBombs++;
      }
      if (cells[i - cellCols].isBomb) { // Above it
        cells[i].nearbyBombs++;
      }
      if (cells[i + cellCols].isBomb) { // Below it
        cells[i].nearbyBombs++;
      }
      if (cells[i - cellCols - 1].isBomb) {// Top Left Corner
        cells[i].nearbyBombs++;
      }
      if (cells[i + cellCols - 1].isBomb) {// Bottom Left Corner
        cells[i].nearbyBombs++;
      }
      if (cells[i - cellCols + 1].isBomb) {// Top right Corner
        cells[i].nearbyBombs++;
      }
      if (cells[i + cellCols + 1].isBomb) {// Bottom Right Corner
        cells[i].nearbyBombs++;
      }
    }
  }
}

var isAtTheSide = (i) => {
  if (i % cellCols === 0) { // right side
    return true;
  }
  if (i % cellCols === cellCols - 1) { // left side
    return true;
  }
  if (i < cellCols) { // upper side
    return true;
  }
  if (i > cellRows * cellCols - cellCols) { // Lower Side
    return true;
  }
  return false; // Not at one of the sides
}

var isAtACorner = (i) => {
  if (i === 0) { // top left corner
    return true;
  }
  if (i === cellCols * cellRows - 1) {  // bottom right corner
    return true;
  }
  if (i === cellRows * cellCols - cellCols) { // bottom left corner
    return true;
  }
  if (i === cellCols - 1) { // top right corner
    return true;
  }
  return false; // Not at the corners
}

function getMousePos(event) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  mouseX = event.clientX - rect.left - root.scrollLeft;
  mouseY = event.clientY - rect.top - root.scrollTop;
}

window.onload = () => {
  canvas = document.getElementById('canvas');
  context = canvas.getContext('2d');

  context.font = '20pt Ariel';
  cellCols = 10;
  cellRows = 10;

  flagImg.src = 'flag.png';

  for (i = 0; i < cellRows * cellCols; i++) {
    cells[i] = new Cell();
    cellsLeft++;
  }

  reset();
  //canvas.addEventListener('mousemove', getMousePos);

  // Prevent Context menu from opening when u right click the mouse
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();

    getMousePos(event);
    let col = Math.floor(mouseX / CELL_WIDTH);
    let row = Math.floor(mouseY / CELL_HEIGHT);
    let i = (col + row * cellCols);
    
    if (!cells[i].isVisible) {  // If cell is visible
      if (cells[i].isFlagged) { // toggle flag
        cells[i].isFlagged = false;
      }
      else {
        cells[i].isFlagged = true;
      }   
    }
  });

  canvas.addEventListener('click', (event) => {
    getMousePos(event);
    let col = Math.floor(mouseX / CELL_WIDTH);
    let row = Math.floor(mouseY / CELL_HEIGHT);
    let i = (col + row * cellCols);
    
    if (!cells[i].isVisible) {  // If cell is visible
      if (event.button === 0) { // left mouse button is pressed 
        if (cells[i].isBomb) {
         gameOver = true;
        }
        else {
          cells[i].isVisible = true;
        }
      }
      else if (event.button === 2) {  // right mouse button is clicked
        if (cells[i].isFlagged) { // toggle flag
          cells[i].isFlagged = false;
        }
        else {
          cells[i].isFlagged = true;

        }   
      }
    }
  });

  setInterval(update, 1000/framesPerSecond);
};

var update = () => {

  if (gameOver) {
    reset();
    gameOver = false;
  }

  // Clear screen
  colorRect(0, 0, canvas.width, canvas.height, 'white');

  for (eachRow = 0; eachRow < cellRows; eachRow++) {
    for (eachCol = 0; eachCol < cellCols; eachCol++) {
      var my_gradient=context.createRadialGradient(CELL_WIDTH * eachCol,
          CELL_HEIGHT * eachRow,
          CELL_WIDTH / 2,
          CELL_WIDTH * eachCol + CELL_WIDTH,
          CELL_HEIGHT * eachRow + CELL_HEIGHT,
          CELL_HEIGHT);
      var i = eachCol + eachRow * cellCols;
      if (cells[i].isVisible) {
        if (cells[i] === 0) {
          colorRect(CELL_WIDTH*eachCol, CELL_HEIGHT*eachRow, CELL_WIDTH, CELL_HEIGHT, 'white');
        }
        else {
          colorRect(CELL_WIDTH*eachCol, CELL_HEIGHT*eachRow, CELL_WIDTH - CELL_GAP, CELL_HEIGHT - CELL_GAP, 'white');

          colorText(cells[i].nearbyBombs, CELL_WIDTH*eachCol + CELL_WIDTH / 2 - 5, CELL_HEIGHT*eachRow + CELL_HEIGHT / 2 + 5, 'black');
        }
      }
      else {
        my_gradient.addColorStop(0,"blue");
        my_gradient.addColorStop(0.5, 'cyan')
        my_gradient.addColorStop(1,"blue");
        colorRect(CELL_WIDTH*eachCol, CELL_HEIGHT*eachRow, CELL_WIDTH - CELL_GAP, CELL_HEIGHT - CELL_GAP, 'blue');
        if (cells[i].isFlagged) {
          context.drawImage(flagImg, CELL_WIDTH*eachCol, CELL_HEIGHT*eachRow, CELL_WIDTH, CELL_HEIGHT);
        }
      }
    }
  }
}

function colorRect(x,y, boxWidth,boxHeight, fillColor) {
  context.fillStyle = fillColor;
  context.fillRect(x,y, boxWidth,boxHeight);
}
function colorCircle(centerX,centerY, radius, fillColor) {
  context.fillStyle = fillColor;
  context.beginPath();
  context.arc(centerX,centerY, radius, 0,Math.PI*2, true);
  context.fill();
}
function colorText(showWords, x, y, fillColor) {
  context.fillStyle = fillColor;
  context.fillText(showWords, x, y);
}
