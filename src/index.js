/**
 * Node.js entry point for backend testing
 */

// This file can be used to test the game logic without a browser

const { Skill, SkillFactory } = require('./Skill.js');
const { Champion, ChampionFactory } = require('./Champion.js');
const { Battle } = require('./Battle.js');

// Create test battle
function runTestBattle() {
    console.log('=== TFT Champion Skills Test ===\n');

    // Create teams
    const team1 = [
        ChampionFactory.createSoldier("Knight"),
        ChampionFactory.createHealer("Cleric"),
        ChampionFactory.createMage("Wizard")
    ];

    const team2 = [
        ChampionFactory.createTank("Guardian"),
        ChampionFactory.createArcher("Ranger"),
        ChampionFactory.createAssassin("Shadow")
    ];

    console.log('Team 1:');
    team1.forEach(c => {
        console.log(`  - ${c.name} (${c.role}): HP=${c.maxHp}, ATK=${c.attack}, Mana=${c.maxMana}, Skill=${c.skill.name}(${c.skill.manaCost})`);
    });

    console.log('\nTeam 2:');
    team2.forEach(c => {
        console.log(`  - ${c.name} (${c.role}): HP=${c.maxHp}, ATK=${c.attack}, Mana=${c.maxMana}, Skill=${c.skill.name}(${c.skill.manaCost})`);
    });

    console.log('\n--- Starting Battle ---\n');

    // Create battle with console logging
    const battle = new Battle(team1, team2, (logEntry) => {
        const prefix = logEntry.type === 'turn' ? '\n' : '  ';
        console.log(`${prefix}${logEntry.message}`);
    });

    // Run battle
    battle.start(0).then(() => {
        console.log('\n=== Battle Complete ===');
    });
}

// Run if executed directly
if (require.main === module) {
    runTestBattle();
}

module.exports = { runTestBattle };
