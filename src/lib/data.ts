import { Feat } from '../components/Party';

export const skills = {
    "Acrobatics": 0,
    "Appraise": 0,
    "Bluff": 0,
    "Climb": 0,
    "Craft": 0,
    "Diplomacy": 0,
    "Disable Device": 0,
    "Disguise": 0,
    "Escape Artist": 0,
    "Fly": 0,
    "Handle Animal": 0,
    "Heal": 0,
    "Intimidate": 0,
    "Knowledge (Arcana)": 0,
    "Knowledge (History)": 0,
    "Knowledge (Local)": 0,
    "Knowledge (Nature)": 0,
    "Knowledge (Nobility)": 0,
    "Knowledge (Planes)": 0,
    "Knowledge (Religion)": 0,
    "Linguistics": 0,
    "Perception": 0,
    "Perform": 0,
    "Profession": 0,
    "Ride": 0,
    "Sense Motive": 0,
    "Sleight of Hand": 0,
    "Spellcraft": 0,
    "Stealth": 0,
    "Survival": 0,
    "Swim": 0,
    "Use Magic Device": 0
};

export const feats: Feat[] = [
  {
    "name": "Acrobatic",
    "description": "+2 bonus on Jump checks and Tumble checks.",
    "levelRequirement": 1
  },
  {
    "name": "Agile",
    "description": "+2 bonus on Balance checks and Escape Artist checks.",
    "levelRequirement": 1
  },
  {
    "name": "Alertness",
    "description": "+2 bonus on Listen checks and Spot checks.",
    "levelRequirement": 1
  },
  {
    "name": "Athletic",
    "description": "+2 bonus on Climb checks and Swim checks.",
    "levelRequirement": 1
  },
  {
    "name": "Combat Expertise",
    "description": "When you use the attack action or full attack action, you can choose to take a –1 penalty on all attack rolls to gain a +1 dodge bonus to your Armor Class. This bonus lasts until your next turn.",
    "levelRequirement": 1,
    "intelligenceRequirement": 13
  },
  {
    "name": "Improved Disarm",
    "description": "+2 bonus on disarm attempts.",
    "levelRequirement": 4,
    "featRequirement": "Combat Expertise"
  },
  {
    "name": "Greater Disarm",
    "description": "+2 bonus on disarm attempts.",
    "levelRequirement": 8,
    "featRequirement": "Improved Disarm"
  },
  {
    "name": "Combat Reflexes",
    "description": "You can make a number of additional attacks of opportunity equal to your Dexterity bonus. With this feat, you can also make attacks of opportunity while flat-footed.",
    "levelRequirement": 1
  },
  {
    "name": "Deceitful",
    "description": "+2 bonus on Bluff checks and Disguise checks.",
    "levelRequirement": 1
  },
  {
    "name": "Defensive Combat Training",
    "description": "You may use your base attack bonus (BAB) as your total Hit Dice when calculating your Combat Maneuver Defense (CMD).",
    "levelRequirement": 1
  },
  {
    "name": "Deft Hands",
    "description": "+2 bonus on Disable Device checks and Sleight of Hand checks.",
    "levelRequirement": 1
  }
];

export const classSkills: { [key: string]: string[] } = {
  Fighter: ["Climb", "Craft", "Handle Animal", "Intimidate", "Jump", "Ride", "Swim"],
  Rogue: ["Acrobatics", "Appraise", "Bluff", "Climb", "Craft", "Diplomacy", "Disable Device", "Disguise", "Escape Artist", "Intimidate", "Knowledge (Local)", "Perception", "Perform", "Sense Motive", "Sleight of Hand", "Stealth", "Swim", "Use Magic Device"],
  Wizard: ["Concentration", "Craft", "Knowledge (all)", "Profession", "Spellcraft"],
  Cleric: ["Concentration", "Craft", "Diplomacy", "Heal", "Knowledge (History)", "Knowledge (Religion)", "Profession", "Spellcraft"],
  Barbarian: ["Climb", "Craft", "Handle Animal", "Intimidate", "Jump", "Listen", "Ride", "Survival", "Swim"],
  Bard: ["Acrobatics", "Appraise", "Bluff", "Climb", "Craft", "Diplomacy", "Disguise", "Escape Artist", "Gather Information", "Knowledge (all)", "Perform", "Sense Motive", "Sleight of Hand", "Spellcraft", "Stealth", "Use Magic Device"],
  Druid: ["Concentration", "Craft", "Diplomacy", "Fly", "Handle Animal", "Heal", "Knowledge (Nature)", "Perception", "Profession", "Ride", "Spellcraft", "Survival", "Swim"],
  Monk: ["Acrobatics", "Climb", "Craft", "Escape Artist", "Intimidate", "Knowledge (History)", "Knowledge (Religion)", "Perception", "Perform", "Sense Motive", "Stealth", "Swim"],
  Paladin: ["Concentration", "Craft", "Diplomacy", "Handle Animal", "Heal", "Knowledge (Nobility)", "Knowledge (Religion)", "Profession", "Sense Motive"],
  Ranger: ["Climb", "Craft", "Handle Animal", "Heal", "Intimidate", "Knowledge (Dungeoneering)", "Knowledge (Geography)", "Knowledge (Nature)", "Perception", "Profession", "Ride", "Stealth", "Survival", "Swim"],
  Sorcerer: ["Bluff", "Concentration", "Craft", "Knowledge (Arcana)", "Spellcraft"],
};

export const skillPointsPerLevel: { [key: string]: number } = {
  Fighter: 2,
  Rogue: 8,
  Wizard: 2,
  Cleric: 2,
  Barbarian: 4,
  Bard: 6,
  Druid: 4,
  Monk: 4,
  Paladin: 2,
  Ranger: 6,
  Sorcerer: 2,
};

export const baseAttackBonusPerClass: { [key: string]: number[] } = {
  Fighter: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Rogue: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
  Wizard: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
  Cleric: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
  Barbarian: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Bard: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
  Druid: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
  Monk: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
  Paladin: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Ranger: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
  Sorcerer: [0, 1, 2, 3, 3, 4, 5, 6, 6, 7, 8, 9, 9, 10, 11, 12, 12, 13, 14, 15],
};

export const savingThrowBaseValues: { [key: string]: { fortitude: number; reflex: number; will: number } } = {
  Fighter: { fortitude: 2, reflex: 0, will: 0 },
  Rogue: { fortitude: 0, reflex: 2, will: 0 },
  Wizard: { fortitude: 0, reflex: 0, will: 2 },
  Cleric: { fortitude: 2, reflex: 0, will: 2 },
  Barbarian: { fortitude: 2, reflex: 0, will: 0 },
  Bard: { fortitude: 0, reflex: 2, will: 2 },
  Druid: { fortitude: 2, reflex: 0, will: 2 },
  Monk: { fortitude: 2, reflex: 2, will: 2 },
  Paladin: { fortitude: 2, reflex: 0, will: 0 },
  Ranger: { fortitude: 2, reflex: 2, will: 0 },
  Sorcerer: { fortitude: 0, reflex: 0, will: 2 },
};
