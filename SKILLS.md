# Champion Skills Reference

This document provides detailed information about all champion skills implemented in the TFT game.

## Skill Categories

### Low-Range Mana Skills (30-40 Mana)
**Purpose**: Quick activation for basic and support champions
**Target Champions**: Entry-level units that can cast skills more frequently

#### 1. Strike (30 Mana) - Soldier/Knight
- **Type**: Single Target Damage
- **Effect**: Deals 40 damage to the enemy with the highest HP
- **Role**: Basic
- **Usage**: Focuses damage on the tankiest enemy

#### 2. Divine Heal (40 Mana) - Healer/Cleric
- **Type**: Healing
- **Effect**: Heals the most wounded ally for 50 HP
- **Role**: Support
- **Usage**: Keeps the team alive by healing injured allies

### Mid-Range Mana Skills (50-60 Mana)
**Purpose**: Balanced skills for mobile and supportive units
**Target Champions**: Specialized units with moderate skill costs

#### 3. Precision Shot (50 Mana) - Archer/Ranger
- **Type**: Single Target Damage
- **Effect**: Deals 60 damage to the enemy with the highest HP
- **Role**: Mobile
- **Usage**: High single-target damage for eliminating priority targets

#### 4. Weakening Curse (60 Mana) - Mage/Wizard
- **Type**: Debuff
- **Effect**: Reduces all enemies' attack by 10 for 2 turns
- **Role**: Support
- **Usage**: Decreases incoming damage by weakening all enemies

### High-Range Mana Skills (80-90 Mana)
**Purpose**: Powerful abilities for tanks and burst damage dealers
**Target Champions**: Late-game impact units with devastating effects

#### 5. Shield Bash (80 Mana) - Tank/Guardian
- **Type**: Crowd Control (Stun)
- **Effect**: Stuns a random enemy for 2 turns
- **Role**: Tank
- **Usage**: Disables an enemy champion, preventing their actions

#### 6. Shadow Strike (90 Mana) - Assassin/Shadow
- **Type**: AOE Damage
- **Effect**: Deals 45 damage to ALL enemies
- **Role**: Burst
- **Usage**: Massive area damage that can turn the tide of battle

## Champion Statistics Table

| Champion | Role | HP | ATK | Max Mana | Mana/Turn | Skill | Mana Cost |
|----------|------|-----|-----|----------|-----------|-------|-----------|
| Soldier/Knight | Basic | 100 | 15 | 50 | 10 | Strike | 30 |
| Healer/Cleric | Support | 80 | 8 | 60 | 12 | Divine Heal | 40 |
| Archer/Ranger | Mobile | 90 | 18 | 80 | 15 | Precision Shot | 50 |
| Mage/Wizard | Support | 70 | 12 | 100 | 20 | Weakening Curse | 60 |
| Tank/Guardian | Tank | 150 | 12 | 120 | 15 | Shield Bash | 80 |
| Assassin/Shadow | Burst | 85 | 25 | 120 | 18 | Shadow Strike | 90 |

## Skill Mechanics

### Mana System
1. Champions start with 0 mana
2. Gain mana at the start of each turn (based on Mana/Turn stat)
3. When mana ≥ skill cost, the skill is automatically cast
4. Mana is consumed upon casting
5. Stunned champions do not gain mana

### Targeting Logic

**Healing Skills**:
- Target: Ally with lowest HP percentage
- Heals up to maximum HP (no overheal)

**Single Target Damage**:
- Target: Enemy with highest current HP
- Prioritizes eliminating tanky threats

**AOE Damage**:
- Target: All alive enemies
- Equal damage to each target

**Stun/CC**:
- Target: Random alive enemy
- Prevents all actions during stun duration

**Buffs/Debuffs**:
- Target: All allies or all enemies
- Stacks by taking the maximum value
- Duration-based effects

### Status Effects

**Stun**:
- Duration: Number of turns
- Effect: Cannot attack, cast skills, or gain mana
- Indicated by purple visual effect

**Attack Buff**:
- Duration: Number of turns
- Effect: Increases base attack temporarily
- Multiple buffs use the highest value

**Attack Debuff**:
- Duration: Number of turns
- Effect: Decreases base attack temporarily
- Multiple debuffs use the highest value

## Combat Flow

1. **Turn Start**: All champions gain mana
2. **Skill Phase**: Champions with enough mana cast their skill
3. **Attack Phase**: Champions without skill cast perform basic attack
4. **Status Update**: All status effects decrement duration
5. **Victory Check**: Battle ends when one team is eliminated

## Visual Feedback

### Animations
- **Healing**: Green glow effect
- **Damage**: Red flash effect
- **Stun**: Purple pulsating effect
- **Skill Cast**: Golden shimmer effect

### Battle Log Colors
- **Yellow**: Skill casting
- **Red**: Damage dealt
- **Green**: Healing
- **Purple**: Stun/CC
- **White**: General actions
- **Bold Red**: Champion defeats

## Strategy Tips

1. **Low Mana Champions** (Soldier, Healer):
   - Cast skills frequently (every 3-5 turns)
   - Good for consistent impact
   - Healer keeps team alive

2. **Mid Mana Champions** (Archer, Mage):
   - Cast skills at critical moments (every 4-6 turns)
   - Balanced offensive and supportive roles
   - Mage's debuff reduces enemy damage significantly

3. **High Mana Champions** (Tank, Assassin):
   - Cast skills late game (every 5-7 turns)
   - Devastating impact when activated
   - Shadow Strike can eliminate weakened enemies
   - Tank's stun can disable key threats

## Skill Expansion Ideas

The current system supports additional skill types:

- **Buff Skills**: Increase ally attack (implemented in SkillFactory)
- **Shield/Barrier**: Absorb damage
- **Lifesteal**: Damage + healing
- **Execute**: Extra damage to low HP targets
- **Multi-hit**: Multiple attacks on random targets
- **Taunt**: Force enemies to attack specific target
- **Cleanse**: Remove debuffs from allies
- **Silence**: Prevent enemy skill casting

These can be added by creating new skill types in the `SkillFactory` class.
