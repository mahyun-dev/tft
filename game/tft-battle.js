// 전투 상태 관리
let battleUnits = [];
let battleMeshes = {};
let battleInterval = null;

function distance2D(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function findNearestEnemy(unit) {
  return battleUnits.filter(u => u.isEnemy !== unit.isEnemy && u.hp > 0)
    .sort((a, b) => distance2D(unit, a) - distance2D(unit, b))[0];
}

function moveUnitToward(unit, target, speed = 0.08) {
  if (!target) return;
  const dx = target.x - unit.x;
  const dy = target.y - unit.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 0.1) return;
  // 3D 이동 애니메이션 적용
  const mesh = battleMeshes[unit.id];
  if (mesh) {
    const toX = unit.x + (dx / dist) * speed;
    const toY = unit.y + (dy / dist) * speed;
    new TWEEN.Tween(mesh.position)
      .to({ x: toX, z: toY }, 40)
      .start();
  }
  unit.x += (dx / dist) * speed;
  unit.y += (dy / dist) * speed;
}

function attackUnit(attacker, target) {
  if (!target || target.hp <= 0) return;
  target.hp -= 20; // 임시 고정 데미지
  // 타격 이펙트(흔들림)
  const mesh = battleMeshes[target.id];
  if (mesh) {
    const origX = mesh.position.x;
    new TWEEN.Tween(mesh.position)
      .to({ x: origX + 0.2 }, 60)
      .yoyo(true)
      .repeat(1)
      .onComplete(() => { mesh.position.x = origX; })
      .start();
  }
}

function updateMeshes() {
  for (const u of battleUnits) {
    const mesh = battleMeshes[u.id];
    if (mesh) {
      mesh.position.x = u.x;
      mesh.position.z = u.y;
      // 스턴 상태면 보라색
      if (u.stunned && u.stunned > 0) {
        mesh.material.color.set(0x9b59b6);
      } else if (u._hitTick) {
        mesh.material.color.set(0xff2222);
        u._hitTick--;
      } else {
        mesh.material.color.set(u.isEnemy ? 0xff4444 : 0x44aaff);
      }
    }
  }
}

// (중복 선언 제거됨)
// tft-battle.js: 3D 전투 로직 및 유닛 소환/애니메이션 (production-ready)
// Three.js의 scene을 외부에서 주입받아야 함
let sceneRef = null;
export function setBattleScene(scene) {
  sceneRef = scene;
}

import { createChampionMesh, createCreepMesh } from './tft-3d-models.js';

// 유닛 소환: 3D 모델/애니메이션 적용, 확장 가능
export function summonUnit(unit, x, y) {
  if (!sceneRef) return null;
  let mesh;
  if (unit.traits && unit.traits.includes('크립')) {
    mesh = createCreepMesh(unit.id);
  } else {
    mesh = createChampionMesh(unit.id);
    if (unit.isEnemy) mesh.material.color.set(0xff4444);
  }
  mesh.position.set(x, 0.75, y);
  mesh.userData.unitId = unit.id;
  sceneRef.add(mesh);
  // 등장 애니메이션
  mesh.scale.set(1, 0.1, 1);
  new TWEEN.Tween(mesh.scale)
    .to({ y: 1 }, 400)
    .easing(TWEEN.Easing.Bounce.Out)
    .start();
  return mesh;
}

// 전투 시작: 유닛 세팅, 기존 유닛 제거, 전투 루프 시작
export function startBattle(units, onBattleEndCb) {
  if (!sceneRef) return;
  // 기존 유닛 제거
  sceneRef.children = sceneRef.children.filter(obj => !obj.userData.unitId);
  battleUnits = units.map(u => ({ ...u, hp: u.hp || (u.stats && u.stats.hp) || 100, mana: u.mana || 0, maxMana: (u.stats && u.stats.mana) || 50 }));
  battleMeshes = {};
  for (const u of battleUnits) {
    const mesh = summonUnit(u, u.x, u.y);
    battleMeshes[u.id] = mesh;
  }
  if (battleInterval) clearInterval(battleInterval);
  battleInterval = setInterval(() => battleTick(onBattleEndCb), 40);
}

// 내부적으로 onBattleEnd 콜백 지원
function battleTick(onBattleEndCb) {
  for (const u of battleUnits) {
    if (u.hp <= 0) continue;
    // 상태이상: 스턴
    if (u.stunned && u.stunned > 0) {
      u.stunned--;
      continue;
    }
    // 마나 시스템: 공격 시 마나 획득
    if (u.mana === undefined) u.mana = u.stats && u.stats.mana !== undefined ? u.stats.mana : 0;
    if (u.maxMana === undefined) u.maxMana = u.stats && u.stats.maxMana !== undefined ? u.stats.maxMana : 50;
    // 스킬 발동
    if (u.mana >= u.maxMana && u.skill && typeof u.skill.effect === 'function') {
      const allies = battleUnits.filter(x => x.isEnemy === u.isEnemy && x.hp > 0);
      const enemies = battleUnits.filter(x => x.isEnemy !== u.isEnemy && x.hp > 0);
      let target = findNearestEnemy(u);
      try {
        u.skill.effect(u, target, allies, enemies);
      } catch (e) { console.error('Skill error', u, e); }
      u.mana = 0;
      // 스킬 연출(색상)
      const mesh = battleMeshes[u.id];
      if (mesh) {
        mesh.material.color.set(0xf7e45c);
        setTimeout(() => mesh.material.color.set(u.isEnemy ? 0xff4444 : 0x44aaff), 400);
      }
      continue;
    }
    // 일반 공격/이동
    const enemy = findNearestEnemy(u);
    if (!enemy) continue;
    const dist = distance2D(u, enemy);
    if (dist > 1.2) {
      moveUnitToward(u, enemy);
    } else {
      attackUnit(u, enemy);
      enemy._hitTick = 2;
      // 마나 획득
      u.mana = Math.min(u.mana + 15, u.maxMana);
    }
  }
  updateMeshes();
  // 전투 종료 체크
  const teamA = battleUnits.some(u => !u.isEnemy && u.hp > 0);
  const teamB = battleUnits.some(u => u.isEnemy && u.hp > 0);
  if (!teamA || !teamB) {
    clearInterval(battleInterval);
    battleInterval = null;
    // 전투 종료 콜백
    if (typeof onBattleEndCb === 'function') {
      onBattleEndCb({
        win: teamA,
        enemyAlive: battleUnits.filter(u => u.isEnemy && u.hp > 0).length
      });
    } else if (typeof window.onBattleEnd === 'function') {
      window.onBattleEnd({
        win: teamA,
        enemyAlive: battleUnits.filter(u => u.isEnemy && u.hp > 0).length
      });
    }
  }
}
