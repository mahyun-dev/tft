/**
 * Skill class - Represents a champion's skill with various effects
 */
class Skill {
    constructor(name, manaCost, effect, description) {
        this.name = name;
        this.manaCost = manaCost;
        this.effect = effect; // Function that executes the skill
        this.description = description;
    }

    /**
     * Check if the skill can be cast based on mana availability
     */
    canCast(champion) {
        return champion.currentMana >= this.manaCost && !champion.isStunned;
    }

    /**
     * Cast the skill
     */
    cast(caster, targets, allAllies, allEnemies) {
        if (!this.canCast(caster)) {
            return null;
        }

        // Consume mana
        caster.currentMana -= this.manaCost;

        // Execute the skill effect
        const result = this.effect(caster, targets, allAllies, allEnemies);

        return {
            caster: caster,
            skill: this,
            result: result
        };
    }
}

/**
 * Skill factory - Creates various skill types
 */
const SkillFactory = {
    /**
     * Create a healing skill (Support role - Low mana)
     */
    createHealSkill(name, manaCost, healAmount) {
        return new Skill(
            name,
            manaCost,
            (caster, targets, allAllies) => {
                // Find the ally with the lowest HP percentage
                const lowestHpAlly = allAllies
                    .filter(ally => ally.isAlive())
                    .sort((a, b) => (a.currentHp / a.maxHp) - (b.currentHp / b.maxHp))[0];

                if (lowestHpAlly) {
                    const actualHeal = Math.min(healAmount, lowestHpAlly.maxHp - lowestHpAlly.currentHp);
                    lowestHpAlly.currentHp += actualHeal;
                    return {
                        type: 'heal',
                        target: lowestHpAlly,
                        amount: actualHeal
                    };
                }
                return { type: 'heal', target: null, amount: 0 };
            },
            `Heals the most wounded ally for ${healAmount} HP`
        );
    },

    /**
     * Create an AOE damage skill (Burst damage - High mana)
     */
    createAOEDamageSkill(name, manaCost, damage) {
        return new Skill(
            name,
            manaCost,
            (caster, targets, allAllies, allEnemies) => {
                const results = [];
                allEnemies.forEach(enemy => {
                    if (enemy.isAlive()) {
                        const actualDamage = Math.min(damage, enemy.currentHp);
                        enemy.takeDamage(actualDamage);
                        results.push({
                            target: enemy,
                            damage: actualDamage
                        });
                    }
                });
                return {
                    type: 'aoe_damage',
                    targets: results
                };
            },
            `Deals ${damage} damage to all enemies`
        );
    },

    /**
     * Create a single-target damage skill (Mid mana)
     */
    createSingleTargetDamageSkill(name, manaCost, damage) {
        return new Skill(
            name,
            manaCost,
            (caster, targets, allAllies, allEnemies) => {
                // Target the enemy with the highest HP
                const target = allEnemies
                    .filter(enemy => enemy.isAlive())
                    .sort((a, b) => b.currentHp - a.currentHp)[0];

                if (target) {
                    const actualDamage = Math.min(damage, target.currentHp);
                    target.takeDamage(actualDamage);
                    return {
                        type: 'single_damage',
                        target: target,
                        damage: actualDamage
                    };
                }
                return { type: 'single_damage', target: null, damage: 0 };
            },
            `Deals ${damage} damage to the highest HP enemy`
        );
    },

    /**
     * Create a stun skill (CC utility - Mid/High mana)
     */
    createStunSkill(name, manaCost, duration) {
        return new Skill(
            name,
            manaCost,
            (caster, targets, allAllies, allEnemies) => {
                // Target a random enemy
                const aliveEnemies = allEnemies.filter(enemy => enemy.isAlive());
                if (aliveEnemies.length > 0) {
                    const target = aliveEnemies[Math.floor(Math.random() * aliveEnemies.length)];
                    target.applyStun(duration);
                    return {
                        type: 'stun',
                        target: target,
                        duration: duration
                    };
                }
                return { type: 'stun', target: null, duration: 0 };
            },
            `Stuns a random enemy for ${duration} turns`
        );
    },

    /**
     * Create a buff skill (Support - Mid mana)
     */
    createBuffSkill(name, manaCost, attackBoost, duration) {
        return new Skill(
            name,
            manaCost,
            (caster, targets, allAllies) => {
                // Buff all allies
                const results = [];
                allAllies.forEach(ally => {
                    if (ally.isAlive()) {
                        ally.applyBuff(attackBoost, duration);
                        results.push({
                            target: ally,
                            boost: attackBoost
                        });
                    }
                });
                return {
                    type: 'buff',
                    targets: results,
                    duration: duration
                };
            },
            `Increases all allies' attack by ${attackBoost} for ${duration} turns`
        );
    },

    /**
     * Create a debuff skill (Support - Mid mana)
     */
    createDebuffSkill(name, manaCost, attackReduction, duration) {
        return new Skill(
            name,
            manaCost,
            (caster, targets, allAllies, allEnemies) => {
                // Debuff all enemies
                const results = [];
                allEnemies.forEach(enemy => {
                    if (enemy.isAlive()) {
                        enemy.applyDebuff(attackReduction, duration);
                        results.push({
                            target: enemy,
                            reduction: attackReduction
                        });
                    }
                });
                return {
                    type: 'debuff',
                    targets: results,
                    duration: duration
                };
            },
            `Reduces all enemies' attack by ${attackReduction} for ${duration} turns`
        );
    }
};

// Make Skill and SkillFactory available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Skill, SkillFactory };
}
