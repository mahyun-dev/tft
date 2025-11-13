// Import SkillFactory if in Node.js environment only
if (typeof module !== 'undefined' && module.exports) {
    const skillModule = require('./Skill.js');
    SkillFactory = skillModule.SkillFactory;
}

/**
 * Champion class - Represents a champion with stats, skills, and combat abilities
 */
class Champion {
    constructor(name, role, maxHp, attack, maxMana, manaPerTurn, skill) {
        this.name = name;
        this.role = role;
        this.maxHp = maxHp;
        this.currentHp = maxHp;
        this.attack = attack;
        this.baseAttack = attack;
        this.maxMana = maxMana;
        this.currentMana = 0;
        this.manaPerTurn = manaPerTurn;
        this.skill = skill;
        
        // Status effects
        this.isStunned = false;
        this.stunDuration = 0;
        this.attackBuff = 0;
        this.buffDuration = 0;
        this.attackDebuff = 0;
        this.debuffDuration = 0;
    }

    /**
     * Check if the champion is alive
     */
    isAlive() {
        return this.currentHp > 0;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        this.currentHp = Math.max(0, this.currentHp - amount);
    }

    /**
     * Apply stun effect
     */
    applyStun(duration) {
        this.isStunned = true;
        this.stunDuration = duration;
    }

    /**
     * Apply attack buff
     */
    applyBuff(boost, duration) {
        this.attackBuff = Math.max(this.attackBuff, boost);
        this.buffDuration = duration;
        this.updateAttack();
    }

    /**
     * Apply attack debuff
     */
    applyDebuff(reduction, duration) {
        this.attackDebuff = Math.max(this.attackDebuff, reduction);
        this.debuffDuration = duration;
        this.updateAttack();
    }

    /**
     * Update attack based on buffs and debuffs
     */
    updateAttack() {
        this.attack = this.baseAttack + this.attackBuff - this.attackDebuff;
        this.attack = Math.max(1, this.attack); // Minimum attack of 1
    }

    /**
     * Update status effects at the end of turn
     */
    updateStatusEffects() {
        // Update stun
        if (this.stunDuration > 0) {
            this.stunDuration--;
            if (this.stunDuration === 0) {
                this.isStunned = false;
            }
        }

        // Update buff
        if (this.buffDuration > 0) {
            this.buffDuration--;
            if (this.buffDuration === 0) {
                this.attackBuff = 0;
                this.updateAttack();
            }
        }

        // Update debuff
        if (this.debuffDuration > 0) {
            this.debuffDuration--;
            if (this.debuffDuration === 0) {
                this.attackDebuff = 0;
                this.updateAttack();
            }
        }
    }

    /**
     * Gain mana at the start of turn
     */
    gainMana() {
        if (!this.isStunned) {
            this.currentMana = Math.min(this.maxMana, this.currentMana + this.manaPerTurn);
        }
    }

    /**
     * Try to cast skill if mana is available
     */
    tryCastSkill(allAllies, allEnemies) {
        if (this.skill && this.skill.canCast(this)) {
            return this.skill.cast(this, null, allAllies, allEnemies);
        }
        return null;
    }

    /**
     * Perform basic attack on a target
     */
    attackTarget(target) {
        if (this.isStunned || !this.isAlive() || !target.isAlive()) {
            return null;
        }

        const damage = this.attack;
        target.takeDamage(damage);

        return {
            attacker: this,
            target: target,
            damage: damage
        };
    }
}

/**
 * Champion Factory - Creates pre-defined champions with specific roles and mana costs
 */
const ChampionFactory = {
    /**
     * LOW MANA - Basic champion (Soldier)
     */
    createSoldier(name = "Soldier") {
        const skill = SkillFactory.createSingleTargetDamageSkill("Strike", 30, 40);
        return new Champion(name, "Basic", 100, 15, 50, 10, skill);
    },

    /**
     * LOW MANA - Support champion (Healer)
     */
    createHealer(name = "Healer") {
        const skill = SkillFactory.createHealSkill("Divine Heal", 40, 50);
        return new Champion(name, "Support", 80, 8, 60, 12, skill);
    },

    /**
     * MID MANA - Mobile/supportive champion (Archer)
     */
    createArcher(name = "Archer") {
        const skill = SkillFactory.createSingleTargetDamageSkill("Precision Shot", 50, 60);
        return new Champion(name, "Mobile", 90, 18, 80, 15, skill);
    },

    /**
     * MID MANA - Supportive champion (Mage)
     */
    createMage(name = "Mage") {
        const skill = SkillFactory.createDebuffSkill("Weakening Curse", 60, 10, 2);
        return new Champion(name, "Support", 70, 12, 100, 20, skill);
    },

    /**
     * HIGH MANA - Tank champion
     */
    createTank(name = "Tank") {
        const skill = SkillFactory.createStunSkill("Shield Bash", 80, 2);
        return new Champion(name, "Tank", 150, 12, 120, 15, skill);
    },

    /**
     * HIGH MANA - Burst damage champion (Assassin)
     */
    createAssassin(name = "Assassin") {
        const skill = SkillFactory.createAOEDamageSkill("Shadow Strike", 90, 45);
        return new Champion(name, "Burst", 85, 25, 120, 18, skill);
    }
};

// Make Champion and ChampionFactory available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Champion, ChampionFactory };
}
