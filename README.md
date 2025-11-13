# TFT - Champion Skills Game

A Teamfight Tactics-style game implementation featuring diverse champion abilities, strategic skill mechanics, and real-time visual combat feedback.

## Features

### 1. **Champion System**
- Six unique champion types with distinct roles
- Role-based stat distributions (HP, Attack, Mana)
- Individual skill abilities with varying mana costs

### 2. **Skill System**
The game implements a comprehensive skill system with diverse effects:

#### Skill Types:
- **Healing**: Restore HP to wounded allies
- **AOE Damage**: Deal damage to all enemies
- **Single Target Damage**: Focus high-damage attacks
- **Stun/CC**: Disable enemies for multiple turns
- **Buffs**: Enhance ally statistics
- **Debuffs**: Weaken enemy capabilities

#### Mana Cost Mechanics:
- **Low-range Mana (30-40)**: Basic champions
  - Soldier: Strike ability
  - Healer: Divine Heal
  
- **Mid-range Mana (50-60)**: Mobile/Supportive units
  - Archer: Precision Shot
  - Mage: Weakening Curse
  
- **High-range Mana (80-90)**: Tanks and burst damage dealers
  - Tank: Shield Bash (Stun)
  - Assassin: Shadow Strike (AOE)

### 3. **Champion Roster**

| Champion | Role | HP | Attack | Mana | Skill | Mana Cost |
|----------|------|-----|--------|------|-------|-----------|
| Soldier | Basic | 100 | 15 | 50 | Strike | 30 |
| Healer | Support | 80 | 8 | 60 | Divine Heal | 40 |
| Archer | Mobile | 90 | 18 | 80 | Precision Shot | 50 |
| Mage | Support | 70 | 12 | 100 | Weakening Curse | 60 |
| Tank | Tank | 150 | 12 | 120 | Shield Bash | 80 |
| Assassin | Burst | 85 | 25 | 120 | Shadow Strike | 90 |

### 4. **Visual Feedback System**
- Real-time HP and Mana bar updates
- Animated skill effects:
  - Healing: Green glow animation
  - Damage: Red flash effect
  - Stun: Purple pulsating effect
  - Skill cast: Golden shimmer
- Status indicators (Stun, buffs, debuffs)
- Comprehensive battle log with color-coded events

### 5. **Combat Mechanics**
- Turn-based battle system
- Automatic mana regeneration
- Priority skill casting when mana is available
- Fallback to basic attacks
- Status effect management (stuns, buffs, debuffs)
- Team-based targeting and strategy

## Project Structure

```
tft/
├── index.html           # Main game interface
├── styles.css           # Visual styling and animations
├── package.json         # Project configuration
├── README.md           # This file
└── src/
    ├── Skill.js        # Skill class and skill factory
    ├── Champion.js     # Champion class and champion factory
    ├── Battle.js       # Battle system and combat logic
    ├── VisualFeedback.js # UI updates and animations
    ├── game.js         # Main game controller
    └── index.js        # Node.js entry point for testing
```

## Installation & Usage

### Web Version (Browser)

1. Simply open `index.html` in a modern web browser
2. Click "Start Battle" to begin the simulation
3. Watch the battle unfold with real-time visual feedback
4. Click "Reset" to start a new battle

### Node.js Version (Testing)

1. Ensure Node.js is installed
2. Run from command line:
   ```bash
   node src/index.js
   ```

## Implementation Details

### Skill Effects

1. **Healing Skills**
   - Target: Ally with lowest HP percentage
   - Effect: Restore HP up to maximum
   - Visual: Green glow animation

2. **AOE Damage Skills**
   - Target: All enemy champions
   - Effect: Deal damage to each alive enemy
   - Visual: Red flash on all targets

3. **Single Target Damage**
   - Target: Enemy with highest HP
   - Effect: Focus damage on priority target
   - Visual: Red flash on target

4. **Stun/CC Skills**
   - Target: Random enemy
   - Effect: Disable actions for duration
   - Visual: Purple pulsating effect

5. **Buff/Debuff Skills**
   - Target: All allies/enemies
   - Effect: Modify attack stat temporarily
   - Visual: Golden shimmer

### Combat Flow

1. **Turn Start**: Champions gain mana based on their mana regeneration rate
2. **Skill Check**: If mana ≥ skill cost, champion casts skill
3. **Basic Attack**: If no skill cast, perform basic attack on random enemy
4. **Status Update**: Update all active status effects (stun, buff, debuff)
5. **Battle End**: Continue until one team is eliminated

### Visual Design

- Responsive layout supporting desktop and mobile
- Gradient backgrounds and smooth animations
- Color-coded teams (Blue vs Red)
- Real-time stat tracking with progress bars
- Scrollable battle log with event categorization

## Technologies Used

- Pure JavaScript (ES6+)
- HTML5 & CSS3
- CSS Animations
- No external dependencies

## Future Enhancements

Potential additions for future versions:
- More champion types and abilities
- Equipment/item system
- Champion leveling and upgrades
- Multiple battle formations
- Player vs AI mode
- Tournament mode with multiple rounds
- Sound effects and music
- Save/load battle replays

## License

MIT License

