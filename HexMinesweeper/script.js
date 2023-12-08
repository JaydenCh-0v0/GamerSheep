document.addEventListener('DOMContentLoaded', () => {
  const gameBoard = document.getElementById('game-board');

  const numRows = 16;
  const numCols = 16;
  const numMines = 40;

  let grid = [];
  let flags = 0;
  let openCells = 0;
  let gameOver = false;

  function initializeGame() {
    generateGrid();
    plantMines();
    calculateNumbers();
    renderGrid();
  }

  function generateGrid() {
    for (let row = 0; row < numRows; row++) {
      grid[row] = [];
      for (let col = 0; col < numCols; col++) {
        grid[row][col] = {
          mine: false,
          opened: false,
          flagged: false,
          question: false,
          number: 0,
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

  function calculateNumbers() {
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        if (!grid[row][col].mine) {
          let count = 0;
          const neighbors = getNeighbors(row, col);
          for (const neighbor of neighbors) {
            if (grid[neighbor.row][neighbor.col].mine) {
              count++;
            }
          }
          grid[row][col].number = count;
        }
      }
    }
  }

  function getNeighbors(row, col) {
    const neighbors = [];
    /**const offsets = [ // offset for square block
      { row: -1, col: 0 },
      { row: 1, col: 0 },
      { row: 0, col: -1 },
      { row: 0, col: 1 },
      { row: -1, col: -1 },
      { row: -1, col: 1 },
      { row: 1, col: -1 },
      { row: 1, col: 1 },
    ];**/
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
    if (row%2==0) 
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

  function renderGrid() {
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
          if (cell.mine) {
            hexagon.classList.add('mine');
            hexagon.innerHTML = '&#128163;'; // Bomb emoji
          } else if (cell.number > 0) {
            hexagon.innerHTML = cell.number;
          }
        } else if (cell.flagged) {
          hexagon.classList.add('flag');
          hexagon.innerHTML = '&#9873;'; // Flag emoji
        } else if (cell.question) {
          hexagon.classList.add('question');
          hexagon.innerHTML = '&#63;'; // Question mark emoji
        }
        hexagon.addEventListener('click', () => {
          if (!gameOver && !cell.opened && !cell.flagged) {
            openCell(row, col);
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
  }

  function openCell(row, col) {
    const cell = grid[row][col];
    if (cell.mine) {
      gameOver = true;
      revealMines();
      alert('Game Over');
    } else if (!cell.opened) {
      cell.opened = true;
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
      renderGrid();
    }
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
        if (grid[row][col].mine) {
          grid[row][col].opened = true;
        }
      }
    }
    renderGrid();
  }

  initializeGame();
});