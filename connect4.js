/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

 //Variables (DOM El's and otherwise)
const heightInput = document.getElementById('height');
const widthInput = document.getElementById('width');
const dimensionBtn = document.getElementById('dimensionButton');
const labels = document.querySelectorAll('label');
const restartBtn = document.getElementById('restart');
let gameOver = false;
restartBtn.hidden = true;
var currPlayer = 1; // active player: 1 or 2
var board = []; // array of rows, each row is array of cells  (board[y][x])

//Board Dimension Event Listener
dimensionBtn.addEventListener('click', function(e) {
  board = [];
  e.preventDefault();
  if(widthInput.value > 10 || widthInput.value < 5 || heightInput.value > 10 || heightInput.value < 5) {
    alert("PLEASE ENTER VALUE BETWEEN 5 AND 10");
  } else {
    WIDTH = parseInt(widthInput.value);
    HEIGHT = heightInput.value;
    makeBoard();
    makeHtmlBoard();
    [heightInput, widthInput, dimensionBtn, document.querySelector('h4')].forEach(el => el.remove());
    labels.forEach(l => l.remove());
    restartBtn.hidden = false;
  }
})

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

function makeBoard() {
  // TODO: set "board" to empty HEIGHT x WIDTH matrix array
  for(i = 0; i < HEIGHT; i++) {
    board.push(new Array(WIDTH).fill(null));
  }
}

/** makeHtmlBoard: make HTML table and row of column tops. */

function makeHtmlBoard() {
  // TODO: get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById('board');
  // TODO: add comment for this code
  //Student Comment: Here, a table row element is created. A tr extends horizontally across a table. It is populuated with table data (td).
  var top = document.createElement("tr");
  //Student Comment: Here, the above created element receives a new attribute, id with a value of column-top. Column-top corresponds with a pre-written CSS id selector that gives any element with this attribute a dashed, gray border
  top.setAttribute("id", "column-top");
  //Student Comment: Here, the top element is given an Event Listener activated by user event, click.
  top.addEventListener("click", handleClick);

  //Student Comment: Here, top is appended with the aforementioned table data. It recieves an attribute of id set equal to the index of the loop. So the third headCell will have an ID of 2. After the loop, the whole of the tr is appended to the board HTML element.
  for (var x = 0; x < WIDTH; x++) {
    var headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  // TODO: add comment for this code
  //Student Comment: First, a loop is initialized. It will run until index reaches value of height - 1 (which equals the actual height of the game board).
  for (var y = 0; y < HEIGHT; y++) {
    //Student Comment: Each time the above loop runs, a table row element is created. Looking ahead, after the nested loop, we can see, each time a tr is created, it is appended to our htmlBoard.
    const row = document.createElement("tr");
    //Student Comment: Here, we run a nested loop, this time stopping when index is equal to the width of the game board. Each time, this loop runs, a table data element is created and stored in variable "cell". This next part is really cool. Cell is given an ID of y (the index from the outside loop) and x (the index from the nested loop). So a cell in the 4th row, 6th column will have an id attribute of id="3-5". Then this cell is appended to the row element created in the outside loop.
    for (var x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

/** findSpotForCol: given column x, return top empty y (null if filled) */
//Student Comment: Given X column, always start at Y = 5 (bottom cell with value of null, falsy). Turn row 5 at x column from falsy to truthy. Next time, start at first falsy value.
function findSpotForCol(x) {
  // TODO: write the real version of this, rather than always returning 0
  for(y = HEIGHT - 1; y >= 0; y--) {
    //Student Comment: Conditional checks status of cell at Y=5, X=input. If cell has value of null, it returns this Y value.
    if(board[y][x] === null) {
      return y;
    }
  }
  return null;
}

/** placeInTable: update DOM to place piece into HTML table of board */

function placeInTable(y, x) {
  // TODO: make a div and insert into correct table cell
  //Student Comment: Create game piece by making a div. Adding class of piece to give it a shape. Adding class of player{1 or 2} for piece color. Place piece in proper spot on table by storing cell element with matching ID in variable placement. Appending the piece to this placement.

  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`player${currPlayer}`)
  const placement = document.getElementById(`${y}-${x}`);
  placement.append(piece);
}

/** endGame: announce game end */

function endGame(msg) {
  alert(msg);
  gameOver = true;
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  if(gameOver) {
    htmlBoard.classList.add('freeze');
    return;
  }

  // get x from ID of clicked cell
  var x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  var y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  // TODO: add line to update in-memory board
  board[y][x] = currPlayer;
  placeInTable(y, x);

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // TODO: check if all cells in board are filled; if so call, call endGame
  if(board.reduce((a, b) => {
    a.push(...b);
    return a;
  }, []).every(v => v !== null)) {
  return endGame("TIE")
  }

  // switch players
  // TODO: switch currPlayer 1 <-> 2
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  // TODO: read and understand this code. Add comments to help you.
  //Student Comment: First, a pair of loops are initialized (WIDTH nested within HEIGHT). These both start at zero index and iterate over the arrays. Within these loops, 4 variables are declared:
  //  *horiz stores a horizontal victory. It does so by maintaining the y index across the array as the x index increases by one. In action, it would look like [[0, 0], [0, 1], [0, 2], [0, 3]];
  //  *vert stores a vertical victory. It mirrors the logic of horiz but maintains x index as y is increased by 1. [[0, 0], [1, 0], [2, 0], [3, 0]];
  //  *diaDR stores a diagonal, right-directed victory. Both values are increased by the same addened. [[0, 0], [1, 1], [2, 2], [3, 3]];
  //  *diaDL stores a diagonal, left-directed victory. Phew, I woulda struggled coming up with this. As y index is increased by an addened, x is decreased by a mirrored subtrahend. [[3, 3], [4, 2], [5, 1], [6, 0]];

  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}
