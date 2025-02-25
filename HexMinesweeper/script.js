const gameBoard = document.getElementById('game-board');
const infoBoard = document.getElementById('info-board');

const numRows = 16;
const numCols = 16;
const numMines = 45;
const numSurvivors = 0;

let follower

let currentPlayer = 0;
let numPlayer = 4;
let gamemode;
let numHP = 3;
let playerInfo = [
  {ID: 'p1', Emoji: '🦖', Name: 'Player A', HP: numHP, Score: 0, Msg: '到達了這個星球', Territories: 0, OldTerritories: 0},
  {ID: 'p2', Emoji: '🐝', Name: 'Player B', HP: numHP, Score: 0, Msg: '到達了這個星球', Territories: 0, OldTerritories: 0},
  {ID: 'p3', Emoji: '🦉', Name: 'Player C', HP: numHP, Score: 0, Msg: '到達了這個星球', Territories: 0, OldTerritories: 0},
  {ID: 'p4', Emoji: '🦈', Name: 'Player D', HP: numHP, Score: 0, Msg: '到達了這個星球', Territories: 0, OldTerritories: 0},
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

// 在文件开头添加音效数组
const explosionSounds = [
    'sound/Explosion1.ogg',
    'sound/Explosion2.ogg',
    'sound/Explosion3.ogg',
    'sound/Explosion4.ogg',
];

function playRandomExplosion() {
    const randomIndex = Math.floor(Math.random() * explosionSounds.length);
    const audio = new Audio(explosionSounds[randomIndex]);
    audio.play();
}

function playSound(path) {
  const audio = new Audio(path);
  audio.play();
}


// follower function
class CursorFollower {
  constructor() {
      this.follower = document.querySelector('.cursor-follower');
      this.eyes = this.follower.querySelectorAll('.eye');
      this.mouseX = 0;
      this.mouseY = 0;
      this.followerX = 0;
      this.followerY = 0;
      this.speed = 0.1; // 跟随速度
      this.isAnimating = false;
      this.crown = this.follower.querySelector('.follower-crown');

      this.init();
      this.updateFollower(); // 添加初始颜色设置
  }

  init() {
      // 监听鼠标移动
      document.addEventListener('mousemove', (e) => {
          this.mouseX = e.clientX;
          this.mouseY = e.clientY;
          this.updateEyes(e);
          if (!this.isAnimating) {
              this.animate();
          }
      });

      // 监听鼠标进入可交互元素
      document.querySelectorAll('.hexagon, button, .game-UtilCatFace').forEach(element => {
          element.addEventListener('mouseenter', () => {
              this.follower.classList.add('hover');
          });
          
          element.addEventListener('mouseleave', () => {
              this.follower.classList.remove('hover');
          });
      });

      // 监听鼠标点击
      document.addEventListener('mousedown', () => {
          this.follower.classList.add('click');
      });

      document.addEventListener('mouseup', () => {
          this.follower.classList.remove('click');
      });

      this.updateFollower(); // 初始化时设置颜色
  }

  updateEyes(e) {
      this.eyes.forEach(eye => {
          const eyeRect = eye.getBoundingClientRect();
          const eyeCenterX = eyeRect.left + eyeRect.width / 2;
          const eyeCenterY = eyeRect.top + eyeRect.height / 2;
          
          const angle = Math.atan2(e.clientY - eyeCenterY, e.clientX - eyeCenterX);
          const distance = Math.min(2, Math.hypot(e.clientX - eyeCenterX, e.clientY - eyeCenterY) / 10);
          
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          eye.style.transform = `translate(${x}px, ${y}px)`;
      });
  }

  animate() {
      this.isAnimating = true;

      // 平滑跟随效果，添加偏移量使跟随器位于鼠标右侧
      this.followerX += (this.mouseX + 30 - this.followerX) * this.speed; // 添加 20px 的横向偏移
      this.followerY += (this.mouseY + 20 - this.followerY) * this.speed;

      this.follower.style.left = `${this.followerX}px`;
      this.follower.style.top = `${this.followerY}px`;

      // 继续动画
      if (
          Math.abs(this.mouseX - this.followerX) > 0.1 ||
          Math.abs(this.mouseY - this.followerY) > 0.1
      ) {
          requestAnimationFrame(() => this.animate());
      } else {
          this.isAnimating = false;
      }
  }

  // 添加更新颜色的方法
  updateFollower() {
      const playerColors = {
          'p1': 'rgba(217, 84, 147, 0.8)',  // 粉色
          'p2': 'rgba(226, 241, 116, 0.8)', // 黄色
          'p3': 'rgba(133, 248, 104, 0.8)', // 绿色
          'p4': 'rgba(103, 183, 249, 0.8)'  // 蓝色
      };
      console.log('当前玩家ID:', playerInfo[currentPlayer].ID);
      console.log('玩家颜色映射:', playerColors);
      const currentPlayerID = playerInfo[currentPlayer].ID;
      this.follower.querySelector('.follower-body').style.backgroundColor = playerColors[currentPlayerID];
      document.getElementById(`follower-crown`).textContent = `${playerInfo[currentPlayer].Emoji}`;
  }

  // 添加显示/隐藏皇冠的方法
  toggleCrown(show) {
      if (this.crown) {
          this.crown.style.display = show ? 'block' : 'none';
      }
  }

  // 添加临时显示皇冠的方法（比如获胜时）
  showCrownTemporarily(duration = 3000) {
      this.toggleCrown(true);
      setTimeout(() => {
          this.toggleCrown(false);
      }, duration);
  }
}

function initializeGame() {
  follower = new CursorFollower();
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
    document.getElementById(`name-${pinfo.ID}`).textContent = `${pinfo.Emoji}: ${pinfo.Name}`;
    document.getElementById(`hp-count-${pinfo.ID}`).textContent = _textHeart(pinfo.HP);
    document.getElementById(`score-count-${pinfo.ID}`).textContent  = `Score: ${pinfo.Score}`;
    document.getElementById(`territories-count-${pinfo.ID}`).textContent  = `Territories: ${pinfo.Territories}`;
    document.getElementById(`msg-${pinfo.ID}`).textContent = `[ ${pinfo.Name} ${pinfo.Msg} ]`;
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
          openCell(row, col, true);
          checkTerritories();
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

function checkTerritories() {
  player = playerInfo[currentPlayer]
  terr = playerInfo[currentPlayer].Territories
  old_terr = playerInfo[currentPlayer].OldTerritories
  new_terr = terr - old_terr
  if (new_terr > 1) { //代表玩家發現多於一塊土地
    if (new_terr < 50) { 
      playSound('sound/Found_Village.oga')
      playerInfo[currentPlayer].Score += 3
      playerInfo[currentPlayer].Msg = `發現了小果園(面積:${new_terr})，獲得了${3}分✨`
    } else{
      playSound('sound/Found_City.oga')
      playerInfo[currentPlayer].Score += 6
      playerInfo[currentPlayer].Msg = `發現了大森林(面積:${new_terr})，獲得了${6}分✨`
    }
  }
  playerInfo[currentPlayer].OldTerritories = terr
}

function nextPlayer() {
  do{
    currentPlayer++;
    if (currentPlayer === numPlayer) currentPlayer = 0;
    if (currentPlayer === 1) round++;
  } while (playerInfo[currentPlayer].HP === 0 && !gameOver)
  
  renderPlayerCard();
  // 添加更新跟班颜色的调用
  follower.updateFollower();
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

function openCell(row, col, isTarget=false) {
  const cell = grid[row][col];
  if (cell.mine) {
    cell.opened = true;
    cell.owner = playerInfo[currentPlayer].ID;
    playerInfo[currentPlayer].Territories++;
    playerInfo[currentPlayer].HP--;
    
    // 播放随机爆炸音效
    playRandomExplosion();
    
    if(_isAllPlayerDie()) {
      gameOver = true;
      revealMines();
      alert(`Game Over.`);
      return;
    }
  } else if (!cell.opened) {
    cell.opened = true;
    cell.owner = playerInfo[currentPlayer].ID;
    if (isTarget) {
      playerInfo[currentPlayer].Score += cell.number
      playerInfo[currentPlayer].Msg = `找到食物，獲得了${cell.number}分`
    }
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
follower.toggleCrown(true)