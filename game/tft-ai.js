
import { getChampionsByCost } from './tft-champions.js';

// 라운드별 적 유닛/AI 팀 생성
export function getEnemyTeam(round) {
  // 예시: 초반은 크립, 이후는 AI 챔피언
  if (round <= 3 || round % 5 === 0) {
    // 크립(중립 몬스터) 라운드: 1~3, 5, 10, 15 등
    return [
      { id: 'creep1', name: '크립', stats: { hp: 400 + round * 30, attackDamage: 30 + round * 5, ...baseCreepStats() }, isCreep: true },
      { id: 'creep2', name: '크립', stats: { hp: 400 + round * 30, attackDamage: 30 + round * 5, ...baseCreepStats() }, isCreep: true }
    ];
  } else {
    // AI 챔피언 팀: 라운드/난이도에 따라 코스트/수량 증가
    const cost = Math.min(1 + Math.floor(round / 4), 5);
    const count = Math.min(2 + Math.floor(round / 2), 7);
    const pool = getChampionsByCost(cost);
    // 랜덤 챔피언 선택
    const team = [];
    for (let i = 0; i < count; i++) {
      const champ = pool[Math.floor(Math.random() * pool.length)];
      team.push({ ...champ, isAI: true });
    }
    return team;
  }
}

function baseCreepStats() {
  return {
    mana: 0,
    maxMana: 0,
    armor: 10,
    magicResist: 10,
    attackSpeed: 0.6,
    attackRange: 1,
    movementSpeed: 1
  };
}

// AI 유닛 행동 결정 (간단한 타겟팅/스킬 우선)
export function aiMove(unit, allies, enemies) {
  // 1. 스킬 쿨/마나가 되면 스킬 사용
  if (unit.skill && unit.mana >= unit.skill.manaCost) {
    // 가장 체력 낮은 적 우선 타겟팅
    const target = enemies.sort((a, b) => a.currentHp - b.currentHp)[0];
    return { type: 'skill', target };
  }
  // 2. 기본 공격: 가장 가까운 적
  const target = enemies.sort((a, b) =>
    Math.hypot(a.x - unit.x, a.y - unit.y) - Math.hypot(b.x - unit.x, b.y - unit.y)
  )[0];
  if (target) {
    return { type: 'attack', target };
  }
  // 3. 이동: 적에게 접근
  if (target) {
    return { type: 'move', to: { x: target.x, y: target.y } };
  }
  // 4. 대기
  return { type: 'wait' };
}
