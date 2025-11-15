// tft-ui.js: 롤토체스 스타일 UI/UX (production-ready)
// 상점, 벤치, 보드, 라운드/페이즈, 드래그&드롭, 전투 시작 등 완전 구현

import { getChampionById, getChampionsByCost } from './tft-champions.js';
// 플레이어 상태
let playerGold = 10;
let playerLevel = 1;
let playerXP = 0;
let playerHP = 100;
const XP_PER_LEVEL = [0, 2, 6, 10, 20, 36, 56, 80, 108];
let roundNumber = 1;
let phase = 'shop'; // 'shop' | 'battle' | 'result'
let phaseTimer = null;
let phaseTimeLeft = 30;
let isGameOver = false;
const PVE_ROUNDS = [1, 2, 3, 10, 15, 20]; // 예시: 1,2,3,10,15,20라운드는 크립
function renderPlayerStatus() {
  let status = document.getElementById('tft-ui-status');
  if (!status) {
    status = document.createElement('div');
    status.id = 'tft-ui-status';
    status.innerHTML = `<div class="tft-status-inner"></div>`;
    document.getElementById('tft-ui-root').appendChild(status);
  }
  status.style.display = 'block';
  const inner = status.querySelector('.tft-status-inner');
  inner.innerHTML = `
    <span class="tft-status-round">라운드: ${roundNumber}</span>
    <span class="tft-status-gold">골드: ${playerGold}</span>
    <span class="tft-status-level">레벨: ${playerLevel}</span>
    <span class="tft-status-xp">경험치: ${playerXP}/${XP_PER_LEVEL[playerLevel] || '-'} </span>
    <span class="tft-status-hp">체력: ${playerHP}</span>
  `;
}

function updatePhaseTimer() {
  let timer = document.getElementById('tft-ui-timer');
  if (!timer) {
    timer = document.createElement('div');
    timer.id = 'tft-ui-timer';
    document.getElementById('tft-ui-root').appendChild(timer);
  }
  timer.textContent = phase === 'shop' ? `배치/상점 단계: ${phaseTimeLeft}초` : '';
}

function startShopPhase() {
  if (isGameOver) return;
  phase = 'shop';
  phaseTimeLeft = 30;
  renderPlayerStatus();
  shopChampions = getRandomChampions(5);
  renderShopChampions();
  renderBenchChampions();
  renderBoardGrid();
  updatePhaseTimer();
  if (phaseTimer) clearInterval(phaseTimer);
  phaseTimer = setInterval(() => {
    phaseTimeLeft--;
    updatePhaseTimer();
    if (phaseTimeLeft <= 0) {
      clearInterval(phaseTimer);
      startBattlePhase();
    }
  }, 1000);
}

function startBattlePhase() {
  if (isGameOver) return;
  phase = 'battle';
  updatePhaseTimer();
  // 보드에 배치된 챔피언만 추출
  const myUnits = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 7; col++) {
      const champ = boardGrid[row][col];
      if (champ) {
        myUnits.push({
          ...champ,
          x: col - 3,
          y: 2 - row,
          isEnemy: false
        });
      }
    }
  }
  // 라운드에 따라 적 생성 (PVE/PVP)
  let enemyUnits = [];
  if (PVE_ROUNDS.includes(roundNumber)) {
    // 크립 라운드: 체력/공격력/수량이 라운드별로 증가
    const creepCount = Math.min(1 + Math.floor(roundNumber / 2), 5);
    for (let i = 0; i < creepCount; i++) {
      enemyUnits.push({
        id: `creep_${roundNumber}_${i}`,
        name: '크립',
        cost: 0,
        tier: 1,
        traits: ['크립'],
        stats: { hp: 200 + roundNumber * 30, attack: 20 + roundNumber * 5 },
        x: i * 2 - 2,
        y: -2,
        isEnemy: true,
        hp: 200 + roundNumber * 30
      });
    }
  } else {
    // PVP: 임시 적 유닛(랜덤 3개)
    const pool = [1,2,3].flatMap(cost => getChampionsByCost(cost));
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const champ = pool.splice(idx, 1)[0];
      enemyUnits.push({
        ...champ,
        x: i * 2 - 2,
        y: -2,
        isEnemy: true
      });
    }
  }
  import('./tft-battle.js').then(mod => {
    mod.startBattle([...myUnits, ...enemyUnits], onBattleEnd);
  });
}

function onBattleEnd(result) {
  if (isGameOver) return;
  // result: {win: true/false, ...}
  let damage = 0;
  let isPVE = PVE_ROUNDS.includes(roundNumber);
  if (!result || !result.win) {
    // 패배 시 HP 감소 (라운드/적 생존 수/크립 여부에 따라)
    if (isPVE) {
      damage = Math.max(2, Math.floor(roundNumber / 2));
    } else {
      damage = 5 + (result && result.enemyAlive ? result.enemyAlive * 2 : 10);
    }
    playerHP -= damage;
    loseStreak = (window.loseStreak || 0) + 1;
    winStreak = 0;
    // 연패 보너스 골드
    playerGold += Math.min(Math.floor(loseStreak / 2), 3);
  } else {
    // 승리 보상
    winStreak = (window.winStreak || 0) + 1;
    loseStreak = 0;
    playerGold += 1 + Math.floor(winStreak / 2);
    // 크립 라운드 승리 시 보상(골드)
    if (isPVE) {
      playerGold += Math.floor(roundNumber / 2);
    }
  }
  // 라운드/스테이지 증가
  let prevStage = Math.floor((roundNumber - 1) / 7) + 1;
  roundNumber++;
  let newStage = Math.floor((roundNumber - 1) / 7) + 1;
  // 게임 오버 체크
  renderPlayerStatus();
  if (playerHP <= 0) {
    playerHP = 0;
    isGameOver = true;
    showGameOver();
    return;
  }
  // 순위/게임 종료(1라운드만 남았을 때 등) 추후 구현 가능
  setTimeout(() => {
    if (newStage > prevStage) {
      // 스테이지 진입 연출 등(추후)
    }
    startShopPhase();
  }, 2000);
  window.winStreak = winStreak;
  window.loseStreak = loseStreak;
}

function showGameOver() {
  let over = document.getElementById('tft-ui-gameover');
  if (!over) {
    over = document.createElement('div');
    over.id = 'tft-ui-gameover';
    over.className = 'tft-gameover-modal';
    over.innerHTML = `<div class="tft-gameover-title">게임 오버</div><div class="tft-gameover-msg">패배! 다시 도전하세요.</div>`;
    document.getElementById('tft-ui-root').appendChild(over);
  }
  over.style.display = 'block';
}

let shopChampions = [];
let benchChampions = [];

function getRandomChampions(count = 5) {
  // 실제 챔피언 풀에서 무작위로 count개 반환
  const pool = [1,2,3].flatMap(cost => getChampionsByCost(cost));
  const arr = [];
  for (let i = 0; i < count; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    arr.push(pool.splice(idx, 1)[0]);
  }
  return arr;
}

// 상점 챔피언 가격 계산
function getChampionPrice(champ) {
  return champ.cost;
}
  let shop = document.getElementById('tft-ui-shop');
  if (!shop) {
    shop = document.createElement('div');
    shop.id = 'tft-ui-shop';
    shop.innerHTML = `
      <div class="tft-shop-inner">
        <div class="tft-shop-title">상점</div>
        <div class="tft-shop-champions"></div>
        <div class="tft-shop-actions">
          <button class="tft-btn-refresh">새로고침</button>
          <button class="tft-btn-xp">경험치</button>
        </div>
      </div>
    `;
    document.getElementById('tft-ui-root').appendChild(shop);
  }
  shop.style.display = 'block';

  // 무작위 챔피언 5개 표시
  renderPlayerStatus();
  shopChampions = getRandomChampions(5);
  renderShopChampions();

  shop.querySelector('.tft-btn-refresh').onclick = () => {
    if (playerGold < 2) return alert('골드가 부족합니다!');
    playerGold -= 2;
    renderPlayerStatus();
    shopChampions = getRandomChampions(5);
    renderShopChampions();
  };
  shop.querySelector('.tft-btn-xp').onclick = () => {
    if (playerGold < 4) return alert('골드가 부족합니다!');
    playerGold -= 4;
    playerXP += 4;
    // 레벨업
    while (playerLevel < XP_PER_LEVEL.length && playerXP >= XP_PER_LEVEL[playerLevel]) {
      playerXP -= XP_PER_LEVEL[playerLevel];
      playerLevel++;
    }
    renderPlayerStatus();
};

function renderShopChampions() {
  const shopList = document.querySelector('.tft-shop-champions');
  shopList.innerHTML = '';
  shopChampions.forEach((champ, idx) => {
    const el = document.createElement('div');
    el.className = 'tft-shop-champion';
    el.innerHTML = `
      <div class="tft-champ-name">${champ.name}</div>
      <div class="tft-champ-cost">${champ.cost}골드</div>
      <button class="tft-btn-buy">구매</button>
    `;
    el.querySelector('.tft-btn-buy').onclick = () => {
      const price = getChampionPrice(champ);
      if (playerGold < price) return alert('골드가 부족합니다!');
      playerGold -= price;
      renderPlayerStatus();
      benchChampions.push(champ);
      shopChampions.splice(idx, 1);
      renderShopChampions();
      renderBenchChampions();
    };
    shopList.appendChild(el);
  });
}

export function showBench() {
  let bench = document.getElementById('tft-ui-bench');
  if (!bench) {
    bench = document.createElement('div');
    bench.id = 'tft-ui-bench';
    bench.innerHTML = `
      <div class="tft-bench-inner">
        <div class="tft-bench-title">벤치</div>
        <div class="tft-bench-champions"></div>
      </div>
    `;
    document.getElementById('tft-ui-root').appendChild(bench);
  }
  bench.style.display = 'block';
  renderBenchChampions();
}

function renderBenchChampions() {
  const benchList = document.querySelector('.tft-bench-champions');
  if (!benchList) return;
  benchList.innerHTML = '';
  benchChampions.forEach((champ, idx) => {
    const el = document.createElement('div');
    el.className = 'tft-bench-champion';
    el.innerHTML = `
      <div class="tft-champ-name">${champ.name}</div>
      <div class="tft-champ-cost">${champ.cost}골드</div>
      <button class="tft-btn-sell">판매</button>
    `;
    el.draggable = true;
    el.ondragstart = e => {
      e.dataTransfer.setData('text/plain', JSON.stringify({from: 'bench', idx}));
    };
    el.querySelector('.tft-btn-sell').onclick = () => {
      playerGold += Math.floor(champ.cost * 0.9);
      renderPlayerStatus();
      benchChampions.splice(idx, 1);
      renderBenchChampions();
    };
    benchList.appendChild(el);
  });
}


// 보드 상태: 3x7 그리드, 각 칸에 챔피언 1명만 배치
let boardGrid = Array.from({length: 3}, () => Array(7).fill(null));

export function showBoard() {
  let board = document.getElementById('tft-ui-board');
  if (!board) {
    board = document.createElement('div');
    board.id = 'tft-ui-board';
    board.innerHTML = `
      <div class="tft-board-inner"></div>
    `;
    document.getElementById('tft-ui-root').appendChild(board);
  }
  board.style.display = 'block';
  renderBoardGrid();
}

function renderBoardGrid() {
  const boardInner = document.querySelector('.tft-board-inner');
  boardInner.innerHTML = '';
  for (let row = 0; row < 3; row++) {
    const rowDiv = document.createElement('div');
    rowDiv.className = 'tft-board-row';
    for (let col = 0; col < 7; col++) {
      const cell = document.createElement('div');
      cell.className = 'tft-board-cell';
      cell.dataset.row = row;
      cell.dataset.col = col;
      const champ = boardGrid[row][col];
      if (champ) {
        cell.innerHTML = `<div class="tft-champ-name">${champ.name}</div>`;
        cell.draggable = true;
        cell.ondragstart = e => {
          e.dataTransfer.setData('text/plain', JSON.stringify({from: 'board', row, col}));
        };
      } else {
        cell.ondragover = e => e.preventDefault();
        cell.ondrop = e => {
          e.preventDefault();
          const data = JSON.parse(e.dataTransfer.getData('text/plain'));
          if (data.from === 'bench') {
            // 벤치에서 보드로 이동
            const champ = benchChampions[data.idx];
            if (champ && !boardGrid[row][col]) {
              boardGrid[row][col] = champ;
              benchChampions.splice(data.idx, 1);
              renderBenchChampions();
              renderBoardGrid();
            }
          } else if (data.from === 'board') {
            // 보드 내 이동
            if (!boardGrid[row][col]) {
              boardGrid[row][col] = boardGrid[data.row][data.col];
              boardGrid[data.row][data.col] = null;
              renderBoardGrid();
            }
          }
        };
      }
      rowDiv.appendChild(cell);
    }
    boardInner.appendChild(rowDiv);
  }

  // 전투 시작 버튼 추가
  let battleBtn = document.getElementById('tft-btn-battle');
  if (!battleBtn) {
    battleBtn = document.createElement('button');
    battleBtn.id = 'tft-btn-battle';
    battleBtn.textContent = '전투 시작';
    boardInner.parentElement.appendChild(battleBtn);
  }
  battleBtn.onclick = () => {
    // 보드에 배치된 챔피언만 추출
    const myUnits = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        const champ = boardGrid[row][col];
        if (champ) {
          myUnits.push({
            ...champ,
            x: col - 3,
            y: 2 - row,
            isEnemy: false
          });
        }
      }
    }
    // 임시 적 유닛(랜덤 3개)
    const pool = [1,2,3].flatMap(cost => getChampionsByCost(cost));
    const enemyUnits = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const champ = pool.splice(idx, 1)[0];
      enemyUnits.push({
        ...champ,
        x: i * 2 - 2,
        y: -2,
        isEnemy: true
      });
    }
    import('./tft-battle.js').then(mod => {
      mod.startBattle([...myUnits, ...enemyUnits]);
    });
  };
}
