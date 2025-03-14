export const logError = (message: string, error: any) => {
      console.error(`ERROR: ${message}`, error);
    };

    export const getAbilityModifier = (score: number): number => {
      return Math.floor((score - 10) / 2);
    };

    export const getHitDie = (characterClass: string): number => {
      const hitDieMap: Record<string, number> = {
        'Fighter': 10,
        'Wizard': 4,
        'Cleric': 8,
        'Rogue': 6,
        'Barbarian': 12,
        'Bard': 6,
        'Druid': 8,
        'Monk': 8,
        'Paladin': 10,
        'Ranger': 8,
        'Sorcerer': 4
      };
      return hitDieMap[characterClass] || 6;
    };
