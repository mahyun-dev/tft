/**
 * VisualFeedback class - Handles visual effects for skill casting
 */
class VisualFeedback {
    constructor() {
        this.animationQueue = [];
    }

    /**
     * Show skill animation on a champion element
     */
    showSkillAnimation(championElement, skillType) {
        const effectDiv = document.createElement('div');
        effectDiv.className = 'skill-effect';

        // Apply animation based on skill type
        switch (skillType) {
            case 'heal':
                effectDiv.classList.add('heal-animation');
                break;
            case 'aoe_damage':
            case 'single_damage':
            case 'damage':
                effectDiv.classList.add('damage-animation');
                break;
            case 'stun':
                effectDiv.classList.add('stun-animation');
                break;
            case 'buff':
            case 'debuff':
            case 'skill':
                effectDiv.classList.add('skill-animation');
                break;
            default:
                effectDiv.classList.add('skill-animation');
        }

        championElement.appendChild(effectDiv);

        // Remove effect after animation completes
        setTimeout(() => {
            effectDiv.remove();
        }, 1500);
    }

    /**
     * Update champion UI
     */
    updateChampionUI(champion, championElement) {
        // Update HP bar
        const hpBar = championElement.querySelector('.hp-bar');
        if (hpBar) {
            const hpPercentage = (champion.currentHp / champion.maxHp) * 100;
            hpBar.style.width = `${hpPercentage}%`;
        }

        // Update HP text
        const hpValue = championElement.querySelector('.stat-value.hp-value');
        if (hpValue) {
            hpValue.textContent = `${Math.round(champion.currentHp)}/${champion.maxHp}`;
        }

        // Update Mana bar
        const manaBar = championElement.querySelector('.mana-bar');
        if (manaBar) {
            const manaPercentage = (champion.currentMana / champion.maxMana) * 100;
            manaBar.style.width = `${manaPercentage}%`;
        }

        // Update Mana text
        const manaValue = championElement.querySelector('.stat-value.mana-value');
        if (manaValue) {
            manaValue.textContent = `${Math.round(champion.currentMana)}/${champion.maxMana}`;
        }

        // Add/remove dead class
        if (!champion.isAlive()) {
            championElement.classList.add('dead');
        } else {
            championElement.classList.remove('dead');
        }

        // Show stun indicator
        let stunIndicator = championElement.querySelector('.stun-indicator');
        if (champion.isStunned) {
            if (!stunIndicator) {
                stunIndicator = document.createElement('div');
                stunIndicator.className = 'stun-indicator';
                stunIndicator.style.cssText = `
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    background: #a855f7;
                    color: white;
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 0.7em;
                    font-weight: bold;
                `;
                stunIndicator.textContent = '⚡ STUNNED';
                championElement.appendChild(stunIndicator);
            }
        } else if (stunIndicator) {
            stunIndicator.remove();
        }
    }

    /**
     * Create champion HTML element
     */
    createChampionElement(champion, teamId) {
        const div = document.createElement('div');
        div.className = 'champion';
        div.id = `${teamId}-${champion.name}`;
        div.style.position = 'relative';

        div.innerHTML = `
            <div class="champion-header">
                <span class="champion-name">${champion.name}</span>
                <span class="champion-role">${champion.role}</span>
            </div>
            <div class="champion-stats">
                <div class="stat-bar">
                    <span class="stat-label">HP:</span>
                    <div class="bar-container">
                        <div class="bar-fill hp-bar" style="width: 100%"></div>
                    </div>
                    <span class="stat-value hp-value">${champion.currentHp}/${champion.maxHp}</span>
                </div>
                <div class="stat-bar">
                    <span class="stat-label">Mana:</span>
                    <div class="bar-container">
                        <div class="bar-fill mana-bar" style="width: 0%"></div>
                    </div>
                    <span class="stat-value mana-value">${champion.currentMana}/${champion.maxMana}</span>
                </div>
                <div class="stat-bar">
                    <span class="stat-label">ATK:</span>
                    <span class="stat-value">${champion.attack}</span>
                </div>
                <div class="stat-bar" style="font-size: 0.8em; color: #666;">
                    <span class="stat-label">Skill:</span>
                    <span class="stat-value" title="${champion.skill.description}">${champion.skill.name} (${champion.skill.manaCost})</span>
                </div>
            </div>
        `;

        return div;
    }

    /**
     * Add log entry to battle log UI
     */
    addLogEntry(logEntry) {
        const logContent = document.getElementById('log-content');
        if (!logContent) return;

        const entryDiv = document.createElement('div');
        entryDiv.className = `log-entry log-${logEntry.type}`;
        entryDiv.textContent = logEntry.message;

        logContent.appendChild(entryDiv);
        logContent.scrollTop = logContent.scrollHeight;
    }

    /**
     * Clear battle log
     */
    clearLog() {
        const logContent = document.getElementById('log-content');
        if (logContent) {
            logContent.innerHTML = '';
        }
    }
}

// Make VisualFeedback available globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { VisualFeedback };
}
