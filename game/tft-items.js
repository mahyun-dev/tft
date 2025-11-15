// tft-items.js: 군장비 테마 아이템 시스템 (production-ready)
// 기본 아이템 (조합 재료)
export const BASE_ITEMS = {
    // 공격 아이템
    'k2_rifle': {
        id: 'k2_rifle',
        name: 'K-2 소총',
        description: '공격력 +15',
        icon: '🔫',
        stats: { attackDamage: 15 }
    },
    'm60_ammo': {
        id: 'm60_ammo',
        name: 'M60 탄약',
        description: '공격속도 +15%',
        icon: '🎯',
        stats: { attackSpeedMultiplier: 0.15 }
    },
    'grenade': {
        id: 'grenade',
        name: '수류탄',
        description: '스킬 피해 +15%',
        icon: '💣',
        stats: { skillDamageBonus: 0.15 }
    },
    
    // 방어 아이템
    'body_armor': {
        id: 'body_armor',
        name: '방탄복',
        description: '방어력 +20',
        icon: '🛡️',
        stats: { armor: 20 }
    },
    'helmet': {
        id: 'helmet',
        name: '군용헬멧',
        description: '마법저항력 +20',
        icon: '⛑️',
        stats: { magicResist: 20 }
    },
    'boots': {
        id: 'boots',
        name: '군화',
        description: '회피 +10%',
        icon: '👢',
        stats: { evasion: 0.1 }
    },
    
    // 마나/유틸 아이템
    'radio': {
        id: 'radio',
        name: '무전기',
        description: '마나 +15',
        icon: '📡',
        stats: { mana: 15 }
    },
    'medkit': {
        id: 'medkit',
        name: '구급낭',
        description: '체력 +200',
        icon: '🏥',
        stats: { hp: 200 }
    }
};

// 조합 아이템
const COMBINED_ITEMS = {
    // K-2 소총 조합
    'k2_rifle+k2_rifle': {
        id: 'sniper_rifle',
        name: 'K-14 저격소총',
        description: '공격력 +50, 사거리 +2, 20% 확률로 치명타 (250%)',
        icon: '🎯',
        stats: { 
            attackDamage: 50, 
            attackRange: 2, 
            critChance: 0.2, 
            critDamage: 2.5 
        }
    },
    'k2_rifle+m60_ammo': {
        id: 'rapid_fire_rifle',
        name: '속사 K-2',
        description: '공격력 +25, 공격속도 +50%',
        icon: '⚡',
        stats: { 
            attackDamage: 25, 
            attackSpeedMultiplier: 0.5 
        }
    },
    'k2_rifle+grenade': {
        id: 'grenade_launcher',
        name: 'K-201 유탄발사기',
        description: '공격력 +30, 공격 시 30% 광역 피해',
        icon: '💥',
        stats: { 
            attackDamage: 30, 
            splashDamage: 0.3 
        }
    },
    'k2_rifle+body_armor': {
        id: 'assault_gear',
        name: '돌격장비',
        description: '공격력 +20, 방어력 +30, 체력 +150',
        icon: '⚔️',
        stats: { 
            attackDamage: 20, 
            armor: 30, 
            hp: 150 
        }
    },
    'k2_rifle+helmet': {
        id: 'combat_helmet',
        name: '전투헬멧',
        description: '공격력 +20, 마법저항력 +30, 기절 면역',
        icon: '🪖',
        stats: { 
            attackDamage: 20, 
            magicResist: 30 
        },
        special: 'stunImmune'
    },
    'k2_rifle+boots': {
        id: 'recon_boots',
        name: '수색화',
        description: '공격력 +20, 이동속도 +30%, 회피 +15%',
        icon: '👟',
        stats: { 
            attackDamage: 20, 
            movementSpeedMultiplier: 0.3, 
            evasion: 0.15 
        }
    },
    'k2_rifle+radio': {
        id: 'tactical_radio',
        name: '전술무전기',
        description: '공격력 +20, 스킬 사용 시 아군 마나 +10',
        icon: '📻',
        stats: { 
            attackDamage: 20 
        },
        special: 'manaShare'
    },
    'k2_rifle+medkit': {
        id: 'combat_medic_kit',
        name: '전투의무장비',
        description: '공격력 +20, 체력 +300, 공격 시 체력 회복 15%',
        icon: '⚕️',
        stats: { 
            attackDamage: 20, 
            hp: 300, 
            lifesteal: 0.15 
        }
    },

    // M60 탄약 조합
    'm60_ammo+m60_ammo': {
        id: 'heavy_machinegun',
        name: '중기관총',
        description: '공격속도 +75%, 공격 시 3회 연속 타격',
        icon: '🔫',
        stats: { 
            attackSpeedMultiplier: 0.75, 
            multiStrike: 3 
        }
    },
    'm60_ammo+grenade': {
        id: 'explosive_rounds',
        name: '폭발탄',
        description: '공격속도 +30%, 스킬 피해 +30%, 공격 시 50 추가 피해',
        icon: '🧨',
        stats: { 
            attackSpeedMultiplier: 0.3, 
            skillDamageBonus: 0.3, 
            onHitDamage: 50 
        }
    },
    'm60_ammo+body_armor': {
        id: 'suppressive_armor',
        name: '제압사격 장비',
        description: '공격속도 +30%, 방어력 +40, 공격 시 적 공격속도 감소',
        icon: '🛡️',
        stats: { 
            attackSpeedMultiplier: 0.3, 
            armor: 40 
        },
        special: 'slowAttack'
    },
    'm60_ammo+helmet': {
        id: 'gunner_helmet',
        name: '사수헬멧',
        description: '공격속도 +30%, 마법저항력 +30, 치명타 확률 +20%',
        icon: '🎖️',
        stats: { 
            attackSpeedMultiplier: 0.3, 
            magicResist: 30, 
            critChance: 0.2 
        }
    },
    'm60_ammo+boots': {
        id: 'rapid_boots',
        name: '기동화',
        description: '공격속도 +30%, 이동속도 +40%, 회피 +10%',
        icon: '⚡',
        stats: { 
            attackSpeedMultiplier: 0.3, 
            movementSpeedMultiplier: 0.4, 
            evasion: 0.1 
        }
    },
    'm60_ammo+radio': {
        id: 'fire_control_system',
        name: '사격통제장치',
        description: '공격속도 +30%, 스킬 사용 시 3초간 공격속도 2배',
        icon: '🎯',
        stats: { 
            attackSpeedMultiplier: 0.3 
        },
        special: 'attackSpeedBurst'
    },
    'm60_ammo+medkit': {
        id: 'sustained_fire',
        name: '지속사격 장비',
        description: '공격속도 +30%, 체력 +250, 초당 체력 30 회복',
        icon: '💊',
        stats: { 
            attackSpeedMultiplier: 0.3, 
            hp: 250, 
            hpRegen: 30 
        }
    },

    // 수류탄 조합
    'grenade+grenade': {
        id: 'c4_explosive',
        name: 'C-4 폭약',
        description: '스킬 피해 +80%, 스킬 사용 시 2x2 범위 추가 폭발 (200 피해)',
        icon: '💥',
        stats: { 
            skillDamageBonus: 0.8 
        },
        special: 'skillExplosion'
    },
    'grenade+body_armor': {
        id: 'demolition_armor',
        name: '폭파병 장비',
        description: '스킬 피해 +35%, 방어력 +50, 피해 받을 시 30% 반사',
        icon: '💣',
        stats: { 
            skillDamageBonus: 0.35, 
            armor: 50, 
            thornsDamage: 0.3 
        }
    },
    'grenade+helmet': {
        id: 'blast_helmet',
        name: '폭발방호 헬멧',
        description: '스킬 피해 +35%, 마법저항력 +50, 광역 피해 면역',
        icon: '🪖',
        stats: { 
            skillDamageBonus: 0.35, 
            magicResist: 50 
        },
        special: 'aoeImmune'
    },
    'grenade+boots': {
        id: 'sapper_boots',
        name: '공병화',
        description: '스킬 피해 +35%, 이동속도 +25%, 스킬 범위 +50%',
        icon: '🎯',
        stats: { 
            skillDamageBonus: 0.35, 
            movementSpeedMultiplier: 0.25, 
            skillRangeBonus: 0.5 
        }
    },
    'grenade+radio': {
        id: 'artillery_radio',
        name: '포병 통신기',
        description: '스킬 피해 +35%, 마나 +20, 스킬 마나 비용 -20',
        icon: '📡',
        stats: { 
            skillDamageBonus: 0.35, 
            mana: 20, 
            manaCostReduction: 20 
        }
    },
    'grenade+medkit': {
        id: 'field_medic_gear',
        name: '야전의무 장비',
        description: '스킬 피해 +35%, 체력 +300, 스킬 사용 시 아군 200 치유',
        icon: '🚑',
        stats: { 
            skillDamageBonus: 0.35, 
            hp: 300 
        },
        special: 'skillHeal'
    },

    // 방탄복 조합
    'body_armor+body_armor': {
        id: 'heavy_armor',
        name: '중장갑',
        description: '방어력 +100, 피해 감소 30%',
        icon: '🛡️',
        stats: { 
            armor: 100, 
            damageReduction: 0.3 
        }
    },
    'body_armor+helmet': {
        id: 'full_combat_gear',
        name: '완전군장',
        description: '방어력 +50, 마법저항력 +50, 모든 디버프 면역',
        icon: '🎖️',
        stats: { 
            armor: 50, 
            magicResist: 50 
        },
        special: 'debuffImmune'
    },
    'body_armor+boots': {
        id: 'tactical_vest',
        name: '전술조끼',
        description: '방어력 +40, 이동속도 +20%, 회피 +20%',
        icon: '🦺',
        stats: { 
            armor: 40, 
            movementSpeedMultiplier: 0.2, 
            evasion: 0.2 
        }
    },
    'body_armor+radio': {
        id: 'command_armor',
        name: '지휘 장비',
        description: '방어력 +40, 마나 +20, 아군 방어력 +15',
        icon: '👔',
        stats: { 
            armor: 40, 
            mana: 20 
        },
        special: 'armorAura'
    },
    'body_armor+medkit': {
        id: 'medic_armor',
        name: '의무병 방호복',
        description: '방어력 +40, 체력 +400, 초당 체력 50 회복',
        icon: '⚕️',
        stats: { 
            armor: 40, 
            hp: 400, 
            hpRegen: 50 
        }
    },

    // 헬멧 조합
    'helmet+helmet': {
        id: 'advanced_helmet',
        name: '첨단 헬멧',
        description: '마법저항력 +100, 스킬 피해 50% 감소',
        icon: '🪖',
        stats: { 
            magicResist: 100, 
            skillDamageReduction: 0.5 
        }
    },
    'helmet+boots': {
        id: 'scout_gear',
        name: '수색 장비',
        description: '마법저항력 +35, 이동속도 +30%, 회피 +25%',
        icon: '🎯',
        stats: { 
            magicResist: 35, 
            movementSpeedMultiplier: 0.3, 
            evasion: 0.25 
        }
    },
    'helmet+radio': {
        id: 'comms_helmet',
        name: '통신 헬멧',
        description: '마법저항력 +35, 마나 +25, 아군 스킬 피해 +15%',
        icon: '📻',
        stats: { 
            magicResist: 35, 
            mana: 25 
        },
        special: 'skillDamageAura'
    },
    'helmet+medkit': {
        id: 'survival_kit',
        name: '생존 키트',
        description: '마법저항력 +35, 체력 +350, 사망 시 1회 부활 (50% 체력)',
        icon: '💚',
        stats: { 
            magicResist: 35, 
            hp: 350 
        },
        special: 'revive'
    },

    // 군화 조합
    'boots+boots': {
        id: 'stealth_boots',
        name: '은신화',
        description: '이동속도 +60%, 회피 +40%, 전투 시작 3초간 무적',
        icon: '👻',
        stats: { 
            movementSpeedMultiplier: 0.6, 
            evasion: 0.4 
        },
        special: 'stealth'
    },
    'boots+radio': {
        id: 'recon_radio',
        name: '정찰 무전기',
        description: '이동속도 +25%, 회피 +15%, 마나 +20, 시야 +2',
        icon: '📡',
        stats: { 
            movementSpeedMultiplier: 0.25, 
            evasion: 0.15, 
            mana: 20, 
            visionRange: 2 
        }
    },
    'boots+medkit': {
        id: 'mobile_medkit',
        name: '이동형 구급낭',
        description: '이동속도 +25%, 회피 +15%, 체력 +300, 이동 중 체력 회복',
        icon: '🏃',
        stats: { 
            movementSpeedMultiplier: 0.25, 
            evasion: 0.15, 
            hp: 300 
        },
        special: 'movementHeal'
    },

    // 무전기 조합
    'radio+radio': {
        id: 'command_center',
        name: '지휘통제소',
        description: '마나 +50, 아군 전체 마나 회복 +10/초, 스킬 마나 -25',
        icon: '🎛️',
        stats: { 
            mana: 50, 
            manaCostReduction: 25 
        },
        special: 'manaAura'
    },
    'radio+medkit': {
        id: 'field_hospital',
        name: '야전병원',
        description: '마나 +30, 체력 +350, 아군 전체 초당 40 체력 회복',
        icon: '🏥',
        stats: { 
            mana: 30, 
            hp: 350 
        },
        special: 'healAura'
    },

    // 구급낭 조합
    'medkit+medkit': {
        id: 'advanced_medkit',
        name: '고급 구급낭',
        description: '체력 +600, 초당 체력 100 회복, 치명상 면역',
        icon: '💚',
        stats: { 
            hp: 600, 
            hpRegen: 100 
        },
        special: 'mortalWoundImmune'
    }
};

// 아이템 조합 함수
export function combineItems(item1, item2) {
  const key1 = `${item1.id}+${item2.id}`;
  const key2 = `${item2.id}+${item1.id}`;
  return COMBINED_ITEMS[key1] || COMBINED_ITEMS[key2] || null;
}

// 유닛에 아이템 적용 (모든 스탯/효과 안전하게 적용)
export function applyItemToUnit(unit, item) {
    if (!unit.items) unit.items = [];
    if (unit.items.length >= 3) return false; // 최대 3개 아이템
    unit.items.push(item);
    // 스탯 적용
    if (item.stats) {
        Object.entries(item.stats).forEach(([key, value]) => {
            // 누적/가산/곱셈 구분
            if (['attackDamage','armor','magicResist','hp','mana','attackRange'].includes(key)) {
                unit.stats[key] = (unit.stats[key] || 0) + value;
                if (key === 'hp') unit.currentHp = (unit.currentHp || 0) + value;
            } else if (key.endsWith('Multiplier')) {
                // 예: attackSpeedMultiplier, movementSpeedMultiplier
                const baseKey = key.replace('Multiplier','');
                unit.stats[baseKey] = (unit.stats[baseKey] || 1) * (1 + value);
            } else if (key === 'critChance' || key === 'evasion' || key === 'lifesteal') {
                unit[key] = (unit[key] || 0) + value;
            } else if (key === 'critDamage') {
                unit[key] = Math.max(unit[key] || 1.5, value);
            } else if (key === 'hpRegen' || key === 'manaRegen') {
                unit[key] = (unit[key] || 0) + value;
            } else if (key === 'damageReduction' || key === 'skillDamageBonus' || key === 'skillRangeBonus' || key === 'thornsDamage') {
                unit[key] = (unit[key] || 0) + value;
            } else if (key === 'multiStrike') {
                unit[key] = value;
            } else if (key === 'visionRange') {
                unit[key] = (unit[key] || 3) + value;
            } else if (key === 'manaCostReduction') {
                unit.stats.maxMana = Math.max(20, (unit.stats.maxMana || 50) - value);
            }
        });
    }
    // 특수효과 플래그
    if (item.special) {
        if (!unit.itemSpecials) unit.itemSpecials = [];
        unit.itemSpecials.push(item.special);
    }
    return true;
}

// 아이템 드롭 시스템 (라운드별)
export function getItemDrops(round) {
  // PVE 라운드: 1~3, 10, 15, 20 등에서만 드롭
  if ([1,2,3,10,15,20].includes(round)) {
    // 난수로 1~2개 드롭, 기본 아이템 중 무작위
    const keys = Object.keys(BASE_ITEMS);
    const drops = [];
    const count = Math.random() < 0.5 ? 1 : 2;
    for (let i = 0; i < count; i++) {
      const idx = Math.floor(Math.random() * keys.length);
      drops.push(BASE_ITEMS[keys[idx]]);
    }
    return drops;
  }
  return [];
}

// 아이템 효과 처리 (전투 중)
// eventType: 'attack', 'skill', 'hit', 'roundStart', ...
export function processItemEffects(unit, eventType, data = {}) {
    if (!unit.items) return;
    unit.items.forEach(item => {
        // 특수효과(special) 처리
        if (item.special) {
            switch (item.special) {
                case 'stunImmune':
                    if (eventType === 'roundStart') unit.stunImmune = true;
                    break;
                case 'manaShare':
                    if (eventType === 'skill' && data.allies) {
                        data.allies.forEach(ally => { if (ally !== unit) ally.mana = (ally.mana || 0) + 10; });
                    }
                    break;
                case 'armorAura':
                    if (eventType === 'roundStart' && data.allies) {
                        data.allies.forEach(ally => { ally.stats.armor = (ally.stats.armor || 0) + 15; });
                    }
                    break;
                case 'skillDamageAura':
                    if (eventType === 'roundStart' && data.allies) {
                        data.allies.forEach(ally => { ally.skillDamageBonus = (ally.skillDamageBonus || 0) + 0.15; });
                    }
                    break;
                case 'revive':
                    if (eventType === 'death') {
                        if (!unit._revived) {
                            unit._revived = true;
                            unit.hp = Math.floor((unit.stats.hp || 100) * 0.5);
                            unit.alive = true;
                        }
                    }
                    break;
                case 'healAura':
                    if (eventType === 'roundStart' && data.allies) {
                        data.allies.forEach(ally => { ally.hpRegen = (ally.hpRegen || 0) + 40; });
                    }
                    break;
                case 'manaAura':
                    if (eventType === 'roundStart' && data.allies) {
                        data.allies.forEach(ally => { ally.manaRegen = (ally.manaRegen || 0) + 10; });
                    }
                    break;
                case 'debuffImmune':
                    if (eventType === 'roundStart') unit.debuffImmune = true;
                    break;
                case 'stealth':
                    if (eventType === 'roundStart') {
                        unit.stealth = true;
                        setTimeout(() => { unit.stealth = false; }, 3000);
                    }
                    break;
                case 'mortalWoundImmune':
                    if (eventType === 'roundStart') unit.mortalWoundImmune = true;
                    break;
                case 'movementHeal':
                    if (eventType === 'move') unit.hp = Math.min(unit.stats.hp, (unit.hp || unit.stats.hp) + 10);
                    break;
                case 'slowAttack':
                    if (eventType === 'attack' && data.target) data.target.stats.attackSpeed *= 0.7;
                    break;
                case 'attackSpeedBurst':
                    if (eventType === 'skill') {
                        unit.stats.attackSpeed *= 2;
                        setTimeout(() => { unit.stats.attackSpeed /= 2; }, 3000);
                    }
                    break;
                case 'skillExplosion':
                    if (eventType === 'skill' && data.enemies) {
                        // 2x2 범위 적에게 200 피해
                        data.enemies.forEach(e => { if (e && Math.abs(e.x - unit.x) <= 1 && Math.abs(e.y - unit.y) <= 1) e.hp -= 200; });
                    }
                    break;
                case 'skillHeal':
                    if (eventType === 'skill' && data.allies) {
                        data.allies.forEach(ally => { ally.hp = Math.min(ally.stats.hp, (ally.hp || ally.stats.hp) + 200); });
                    }
                    break;
                default:
                    break;
            }
        }
        // 일반 효과
        if (item.stats && item.stats.lifesteal && eventType === 'attack' && data.damage && unit.hp) {
            unit.hp = Math.min(unit.stats.hp, unit.hp + Math.floor(data.damage * item.stats.lifesteal));
        }
        if (item.stats && item.stats.onHitDamage && eventType === 'attack' && data.target) {
            data.target.hp -= item.stats.onHitDamage;
        }
        if (item.stats && item.stats.thornsDamage && eventType === 'hit' && data.attacker) {
            data.attacker.hp -= Math.floor((data.damage || 0) * item.stats.thornsDamage);
        }
        if (item.stats && item.stats.multiStrike && eventType === 'attack' && data.target) {
            for (let i = 1; i < item.stats.multiStrike; i++) {
                data.target.hp -= Math.floor((unit.stats.attackDamage + (unit.buffAttackDamage||0)) * 0.5);
            }
        }
        if (item.stats && item.stats.splashDamage && eventType === 'attack' && data.enemies) {
            data.enemies.forEach(e => {
                if (e !== data.target && Math.abs(e.x - data.target.x) <= 1 && Math.abs(e.y - data.target.y) <= 1) {
                    e.hp -= Math.floor((unit.stats.attackDamage + (unit.buffAttackDamage||0)) * item.stats.splashDamage);
                }
            });
        }
    });
}
