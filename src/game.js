/**
 * Main game initialization and control
 */

let battle = null;
let visualFeedback = null;
let team1Champions = [];
let team2Champions = [];

/**
 * Initialize the game
 */
function initGame() {
    visualFeedback = new VisualFeedback();

    // Create Team 1 - Diverse set of champions
    team1Champions = [
        ChampionFactory.createSoldier("Knight"),
        ChampionFactory.createHealer("Cleric"),
        ChampionFactory.createMage("Wizard")
    ];

    // Create Team 2
    team2Champions = [
        ChampionFactory.createTank("Guardian"),
        ChampionFactory.createArcher("Ranger"),
        ChampionFactory.createAssassin("Shadow")
    ];

    // Render champions
    renderTeams();

    // Setup event listeners
    document.getElementById('start-battle').addEventListener('click', startBattle);
    document.getElementById('reset-battle').addEventListener('click', resetGame);
}

/**
 * Render both teams
 */
function renderTeams() {
    const team1Container = document.getElementById('team1-champions');
    const team2Container = document.getElementById('team2-champions');

    // Clear existing
    team1Container.innerHTML = '';
    team2Container.innerHTML = '';

    // Render Team 1
    team1Champions.forEach(champion => {
        const element = visualFeedback.createChampionElement(champion, 'team1');
        team1Container.appendChild(element);
    });

    // Render Team 2
    team2Champions.forEach(champion => {
        const element = visualFeedback.createChampionElement(champion, 'team2');
        team2Container.appendChild(element);
    });
}

/**
 * Update all champion UIs
 */
function updateAllChampionUIs() {
    [...team1Champions, ...team2Champions].forEach(champion => {
        const teamId = team1Champions.includes(champion) ? 'team1' : 'team2';
        const element = document.getElementById(`${teamId}-${champion.name}`);
        if (element) {
            visualFeedback.updateChampionUI(champion, element);
        }
    });
}

/**
 * Handle battle update callback
 */
function onBattleUpdate(logEntry) {
    // Add log entry to UI
    visualFeedback.addLogEntry(logEntry);

    // Update champion UIs
    updateAllChampionUIs();

    // Show visual effects for certain log types
    if (logEntry.type === 'skill' || logEntry.type === 'heal' || 
        logEntry.type === 'damage' || logEntry.type === 'stun') {
        
        // Extract champion name from message
        const match = logEntry.message.match(/^(\w+)/);
        if (match) {
            const championName = match[1];
            
            // Find champion element
            const element = document.getElementById(`team1-${championName}`) || 
                          document.getElementById(`team2-${championName}`);
            
            if (element) {
                visualFeedback.showSkillAnimation(element, logEntry.type);
            }
        }

        // For targeted effects, also show on target
        if (logEntry.type === 'heal' || logEntry.type === 'damage') {
            const targetMatch = logEntry.message.match(/(\w+) (?:is healed|takes|has been defeated)/);
            if (targetMatch && targetMatch[1]) {
                const targetName = targetMatch[1];
                const targetElement = document.getElementById(`team1-${targetName}`) || 
                                    document.getElementById(`team2-${targetName}`);
                
                if (targetElement) {
                    visualFeedback.showSkillAnimation(targetElement, logEntry.type);
                }
            }
        }
    }
}

/**
 * Start the battle
 */
async function startBattle() {
    const startButton = document.getElementById('start-battle');
    const resetButton = document.getElementById('reset-battle');

    // Disable start button
    startButton.disabled = true;

    // Clear previous log
    visualFeedback.clearLog();

    // Create and start battle
    battle = new Battle(team1Champions, team2Champions, onBattleUpdate);
    
    // Start battle with 800ms delay between actions
    await battle.start(800);

    // Enable buttons after battle
    startButton.disabled = false;
    resetButton.disabled = false;
}

/**
 * Reset the game
 */
function resetGame() {
    // Stop current battle if running
    if (battle && battle.isRunning) {
        battle.stop();
    }

    // Clear log
    visualFeedback.clearLog();

    // Recreate champions
    team1Champions = [
        ChampionFactory.createSoldier("Knight"),
        ChampionFactory.createHealer("Cleric"),
        ChampionFactory.createMage("Wizard")
    ];

    team2Champions = [
        ChampionFactory.createTank("Guardian"),
        ChampionFactory.createArcher("Ranger"),
        ChampionFactory.createAssassin("Shadow")
    ];

    // Re-render
    renderTeams();

    // Enable start button
    document.getElementById('start-battle').disabled = false;
}

// Initialize game when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGame);
} else {
    initGame();
}
