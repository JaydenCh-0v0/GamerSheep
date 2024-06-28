const gameBoard = document.getElementById('game-board');
const infoBoard = document.getElementById('info-board');

const numRows = 16;
const numCols = 16;
const numMines = 45;
const numSurvivors = 0;

let currentPlayer = 0;
let numPlayer = 3;
let gamemode;
let numHP = 3;
let playerInfo = [
  {ID: 'p1', Name: 'Player A', HP: numHP, Score: 0, Oxygen: 100, Territories: 0},
  {ID: 'p2', Name: 'Player B', HP: numHP, Score: 0, Oxygen: 100, Territories: 0},
  {ID: 'p3', Name: 'Player C', HP: numHP, Score: 0, Oxygen: 100, Territories: 0},
  {ID: 'p4', Name: 'Player D', HP: numHP, Score: 0, Oxygen: 100, Territories: 0},
]

let round = 1;
let grid = [];
let flags = 0;
let openCells = 0;
let gameOver = false;

// InfoBox data
let roundElement; 
let mineCountElement;
let flagCountElement;
let restartButtonElement;

function initializeGame() {
  generateGrid();
  plantMines();
  plantSurvivor();
  calculateNumbers();
  renderGrid();
  renderPlayerCard();
  initializeInfoBox();
}

function generateGrid() {
  for (let row = 0; row < numRows; row++) {
    grid[row] = [];
    for (let col = 0; col < numCols; col++) {
      grid[row][col] = {
        mine    : false ,
        survivor: false ,
        owner   : 'none',
        opened  : false ,
        flagged : false ,
        number  : 0     ,
      };
    }
  }
}

function plantMines() {
  let plantedMines = 0;
  while (plantedMines < numMines) {
    const randomRow = Math.floor(Math.random() * numRows);
    const randomCol = Math.floor(Math.random() * numCols);
    if (!grid[randomRow][randomCol].mine) {
      grid[randomRow][randomCol].mine = true;
      plantedMines++;
    }
  }
}

function plantSurvivor(){
  let plantedSurvivors = 0;
  while (plantedSurvivors < numSurvivors) {
    const randomRow = Math.floor(Math.random() * numRows);
    const randomCol = Math.floor(Math.random() * numCols);
    if (!grid[randomRow][randomCol].mine && !grid[randomRow][randomCol].survivor) {
      grid[randomRow][randomCol].survivor = true;
      plantedSurvivors++;
    }
  }
}

function calculateNumbers() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!grid[row][col].mine && !grid[row][col].survivor) {
        let count = 0;
        const neighbors = getNeighbors(row, col);
        for (const neighbor of neighbors) {
          if (grid[neighbor.row][neighbor.col].mine) {
            count++;
          }
          if (grid[neighbor.row][neighbor.col].survivor) {
            count += 0.5;
          }
        }
        grid[row][col].number = count;
      }
    }
  }
}

function getNeighbors(row, col) {
  const neighbors = [];
  const offsets_RowEven = [
      { row: -1, col: -1 }, { row: -1, col:  0 },
      { row:  0, col: -1 }, { row:  0, col: +1 },
      { row: +1, col: -1 }, { row: +1, col:  0 },
  ];
  const offsets_RowOdd = [
      { row: -1, col:  0 }, { row: -1, col: +1 },
      { row:  0, col: -1 }, { row:  0, col: +1 },
      { row: +1, col:  0 }, { row: +1, col: +1 },
  ];
  if (row % 2 == 0) 
      offsets = offsets_RowEven;
  else
      offsets = offsets_RowOdd;
  for (const offset of offsets) {
    const neighborRow = row + offset.row;
    const neighborCol = col + offset.col;
    if (
      neighborRow >= 0 &&
      neighborRow < numRows &&
      neighborCol >= 0 &&
      neighborCol < numCols
    ) {
      neighbors.push({ row: neighborRow, col: neighborCol });
    }
  }
  return neighbors;
}

// Render --> Update web UI

function renderPlayerCard() {
  playerInfo.forEach(pinfo => {
    document.getElementById(`hp-count-${pinfo.ID}`).textContent = _textHeart(pinfo.HP);
    document.getElementById(`score-count-${pinfo.ID}`).textContent  = `Score: ${pinfo.Score}`;
    document.getElementById(`territories-count-${pinfo.ID}`).textContent  = `Territories: ${pinfo.Territories}`;
    document.getElementById(`oxygen-count-${pinfo.ID}`).textContent = `Oxygen: ${pinfo.Oxygen} %`;
    document.getElementById(`id-${pinfo.ID}`).classList.remove('focus');
  });
  document.getElementById(`id-${playerInfo[currentPlayer].ID}`).classList.add('focus');
}

function _textHeart(hp) {
  textHeart = ' ';
  for (let i = 0; i < hp; i++) textHeart+='❤ ';
  return textHeart;
}

function renderGrid() {
  console.log('renderGrid');
  gameBoard.innerHTML = '';
  for (let row = 0; row < numRows; row++) {
      const hexagonRow = document.createElement('div');
      hexagonRow.classList.add('hexagon-row');
      if (row % 2 !== 0) hexagonRow.classList.add('even');
    for (let col = 0; col < numCols; col++) {

      const cell = grid[row][col];
      const hexagon = document.createElement('div');
      hexagon.classList.add('hexagon');
      if (cell.opened) {
        hexagon.classList.add('opened');
        hexagon.classList.add(cell.owner);
        if (cell.mine) {
          hexagon.classList.add('mine');
          hexagon.innerHTML = '&#128163;'; // Bomb emoji
        } else if (cell.number > 0) {
          hexagon.innerHTML = cell.number;
        }
      } else if (cell.flagged) {
        hexagon.classList.add('flag');
        hexagon.innerHTML = '&#9873;'; // Flag emoji
      } else if (cell.closed) {
        hexagon.classList.add('closed');
      } else {
        hexagon.classList.add('openable');
      }

      hexagon.addEventListener("mouseover", function(event) {
        if (event.shiftKey) { //Shift + RGBY XW
          hexagon.style.backgroundColor = getRandomRGBColor();
        }
      });

      hexagon.addEventListener('click', () => {
        if (!gameOver && !cell.opened && !cell.flagged) {
          openCell(row, col);
          nextPlayer();
        }
      });

      hexagon.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (!gameOver && !cell.opened) {
          toggleFlag(row, col);
        }
      });

      hexagonRow.appendChild(hexagon);
    }
    gameBoard.appendChild(hexagonRow);
  }
  updateInfoBox();
}

function nextPlayer() {
  do{
    currentPlayer++;
    if (currentPlayer === numPlayer) currentPlayer = 0;
    if (currentPlayer === 1) round++;
  } while (playerInfo[currentPlayer].HP === 0 && !gameOver)
  
  renderPlayerCard();
}

function initializeInfoBox() {
  roundElement = document.getElementById('round');
  mineCountElement = document.getElementById('mine-count');
  flagCountElement = document.getElementById('flag-count');
  restartButtonElement = document.getElementById('restart-button');
  gamemode = "multiplayer"
  switch(numPlayer){
    case 1:
      document.getElementById('id-p2').hidden = true;
    case 2:
      document.getElementById("id-p3").hidden = true;
    case 3:
      document.getElementById("id-p4").hidden = true;
    default: 
      gamemode = "singleplayer"
      break;
  }
}

function initializePlayerInfoBox() {

}

function updateInfoBox() {
  if (mineCountElement && flagCountElement) {
    roundElement.textContent = `Round: ${round}`;
    mineCountElement.textContent = `Mines: ${numMines}`;
    flagCountElement.textContent = `Flags: ${flags}`;
  }
} 

function getRandomRGBColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

function openCell(row, col) {
  const cell = grid[row][col];
  if (cell.mine) {
    cell.opened = true;
    cell.owner = playerInfo[currentPlayer].ID;
    playerInfo[currentPlayer].Territories++;
    playerInfo[currentPlayer].HP--;
    if(_isAllPlayerDie()) {
      gameOver = true;
      revealMines();
      alert(`Game Over.`);
      return;
    }
  } else if (!cell.opened) {
    cell.opened = true;
    cell.owner = playerInfo[currentPlayer].ID;
    playerInfo[currentPlayer].Territories++;
    openCells++;
    if (cell.number === 0) {
      const neighbors = getNeighbors(row, col);
      for (const neighbor of neighbors) {
        const neighborCell = grid[neighbor.row][neighbor.col];
        if (!neighborCell.opened) {
          openCell(neighbor.row, neighbor.col);
        }
      }
    }
    if (openCells === numRows * numCols - numMines) {
      gameOver = true;
      alert('You Win!');
    }
  }
  renderGrid();
}

function _isAllPlayerDie(){
  var sum = 0;
  for (let i = 0; i < numPlayer; i++) sum += playerInfo[i].HP;
  return (sum === 0);
}

function toggleFlag(row, col) {
  const cell = grid[row][col];
  if (!cell.flagged) {
    cell.flagged = true;
    flags++;
  } else {
    cell.flagged = false;
    flags--;
  }
  renderGrid();
}

function revealMines() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      grid[row][col].closed = true;
      if (grid[row][col].mine) {
        grid[row][col].opened = true;
      }
    }
  }
  renderGrid();
}

function restartGame() {
  grid = [];
  flags = 0;
  openCells = 0;
  currentPlayer = 0;
  gameOver = false;
  // need to reset player hp

  initializeGame();
}

initializeGame();