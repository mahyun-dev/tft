/**
 * Battle class - Manages combat between two teams
 */
class Battle {
    constructor(team1, team2, onUpdate) {
        this.team1 = team1;
        this.team2 = team2;
        this.onUpdate = onUpdate; // Callback for UI updates
        this.battleLog = [];
        this.isRunning = false;
        this.turn = 0;
    }

    /**
     * Add entry to battle log
     */
    log(message, type = 'normal') {
        const logEntry = {
            turn: this.turn,
            message: message,
            type: type
        };
        this.battleLog.push(logEntry);
        if (this.onUpdate) {
            this.onUpdate(logEntry);
        }
    }

    /**
     * Check if battle is over
     */
    isBattleOver() {
        const team1Alive = this.team1.some(c => c.isAlive());
        const team2Alive = this.team2.some(c => c.isAlive());
        return !team1Alive || !team2Alive;
    }

    /**
     * Get winner
     */
    getWinner() {
        const team1Alive = this.team1.some(c => c.isAlive());
        const team2Alive = this.team2.some(c => c.isAlive());
        
        if (!team1Alive && !team2Alive) return null;
        if (!team1Alive) return 'Team 2';
        if (!team2Alive) return 'Team 1';
        return null;
    }

    /**
     * Process a turn for a champion
     */
    async processTurn(champion, allies, enemies) {
        if (!champion.isAlive()) {
            return;
        }

        // Gain mana
        champion.gainMana();

        // Check if stunned
        if (champion.isStunned) {
            this.log(`${champion.name} is stunned!`, 'stun');
            return;
        }

        // Try to cast skill
        const skillResult = champion.tryCastSkill(allies, enemies);
        if (skillResult) {
            await this.handleSkillCast(skillResult);
        } else {
            // Basic attack
            const aliveEnemies = enemies.filter(e => e.isAlive());
            if (aliveEnemies.length > 0) {
                const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                const attackResult = champion.attackTarget(target);
                if (attackResult) {
                    this.log(`${champion.name} attacks ${target.name} for ${attackResult.damage} damage`, 'attack');
                    
                    if (!target.isAlive()) {
                        this.log(`${target.name} has been defeated!`, 'death');
                    }
                }
            }
        }

        // Update status effects
        champion.updateStatusEffects();
    }

    /**
     * Handle skill cast
     */
    async handleSkillCast(skillResult) {
        const { caster, skill, result } = skillResult;
        
        this.log(`${caster.name} casts ${skill.name}!`, 'skill');

        // Handle different skill types
        switch (result.type) {
            case 'heal':
                if (result.target) {
                    this.log(`${result.target.name} is healed for ${result.amount} HP`, 'heal');
                }
                break;

            case 'aoe_damage':
                result.targets.forEach(t => {
                    this.log(`${t.target.name} takes ${t.damage} damage`, 'damage');
                    if (!t.target.isAlive()) {
                        this.log(`${t.target.name} has been defeated!`, 'death');
                    }
                });
                break;

            case 'single_damage':
                if (result.target) {
                    this.log(`${result.target.name} takes ${result.damage} damage`, 'damage');
                    if (!result.target.isAlive()) {
                        this.log(`${result.target.name} has been defeated!`, 'death');
                    }
                }
                break;

            case 'stun':
                if (result.target) {
                    this.log(`${result.target.name} is stunned for ${result.duration} turns!`, 'stun');
                }
                break;

            case 'buff':
                this.log(`All allies gain +${result.targets[0].boost} attack for ${result.duration} turns`, 'buff');
                break;

            case 'debuff':
                this.log(`All enemies lose ${result.targets[0].reduction} attack for ${result.duration} turns`, 'debuff');
                break;
        }
    }

    /**
     * Run battle simulation
     */
    async start(delay = 1000) {
        this.isRunning = true;
        this.turn = 0;
        this.log('Battle begins!', 'start');

        while (!this.isBattleOver() && this.isRunning) {
            this.turn++;
            this.log(`--- Turn ${this.turn} ---`, 'turn');

            // Team 1 actions
            for (const champion of this.team1) {
                if (!this.isRunning) break;
                await this.processTurn(champion, this.team1, this.team2);
                await this.sleep(delay);
                
                if (this.isBattleOver()) break;
            }

            if (this.isBattleOver()) break;

            // Team 2 actions
            for (const champion of this.team2) {
                if (!this.isRunning) break;
                await this.processTurn(champion, this.team2, this.team1);
                await this.sleep(delay);
                
                if (this.isBattleOver()) break;
            }
        }

        if (this.isRunning) {
            const winner = this.getWinner();
            this.log(`Battle Over! ${winner} wins!`, 'victory');
        }

        this.isRunning = false;
    }

    /**
     * Stop battle
     */
    stop() {
        this.isRunning = false;
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Make Battle available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Battle };
}
