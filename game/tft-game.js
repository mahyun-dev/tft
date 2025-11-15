import { showShop, showBench, showBoard, updateUI, showGameOver } from './tft-ui.js';
import { startBattle } from './tft-battle.js';

// 게임 상태 객체
const gameState = {
  round: 1,
  phase: 'shop', // 'shop' | 'battle' | 'result'
  player: {
    hp: 100,
    gold: 10,
    bench: [],
    board: [],
    synergies: [],
    streak: 0
  },
  ai: {
    hp: 100,
    board: [],
    synergies: []
  },
  shop: [],
  isGameOver: false
};

export function startGame() {
  // 게임 상태 초기화
  gameState.round = 1;
  gameState.phase = 'shop';
  gameState.player.hp = 100;
  gameState.player.gold = 10;
  gameState.player.bench = [];
  gameState.player.board = [];
  gameState.player.synergies = [];
  gameState.player.streak = 0;
  gameState.ai.hp = 100;
  gameState.ai.board = [];
  gameState.ai.synergies = [];
  gameState.shop = [];
  gameState.isGameOver = false;
  // UI 초기화
  showShop(gameState);
  showBench(gameState);
  showBoard(gameState);
  updateUI && updateUI(gameState);
}

export function nextRound() {
  if (gameState.isGameOver) return;
  // 라운드 증가 및 상태 전환
  gameState.round++;
  gameState.phase = 'battle';
  // 전투 시작
  startBattle(gameState, onBattleEnd);
  updateUI && updateUI(gameState);
}

function onBattleEnd(result) {
  // result: {win: true/false, playerHpLoss, aiHpLoss}
  gameState.phase = 'result';
  if (result) {
    gameState.player.hp -= result.playerHpLoss || 0;
    gameState.ai.hp -= result.aiHpLoss || 0;
    if (result.win) gameState.player.streak++;
    else gameState.player.streak = 0;
  }
  // 게임 오버 체크
  if (gameState.player.hp <= 0 || gameState.ai.hp <= 0) {
    gameState.isGameOver = true;
    showGameOver && showGameOver(gameState);
    return;
  }
  // 다음 라운드 준비 (상점/보상 등)
  gameState.phase = 'shop';
  // 예시: 골드 보상
  gameState.player.gold += 5 + Math.max(0, gameState.player.streak - 1);
  showShop(gameState);
  showBench(gameState);
  showBoard(gameState);
  updateUI && updateUI(gameState);
}

// 게임 상태 외부에서 접근 가능하도록 export
export function getGameState() {
  return gameState;
}
