import React from 'react';
import { Character } from './Party';

interface CharacterSheetProps {
  character: Character;
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character }) => {
  return (
    <div className="mt-8 p-4 border rounded-md shadow-sm dark:bg-gray-800 dark:border-gray-700">
      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">Selected Character: {character.name}</h3>
      <div className="grid grid-cols-2 gap-4 text-gray-700 dark:text-gray-200">
        <div>
          <strong>Character Name:</strong> {character.name}
        </div>
        <div>
          <strong>Player Name:</strong> {character.playerName}
        </div>
        <div>
          <strong>Race:</strong> {character.race}
        </div>
        <div>
          <strong>Alignment:</strong> {character.alignment}
        </div>
        <div>
          <strong>Class:</strong> {character.class}
        </div>
        <div>
          <strong>Level:</strong> {character.level}
        </div>
        <div>
          <strong>Deity:</strong> {character.deity}
        </div>
        <div>
          <strong>Height:</strong> {character.height}
        </div>
        <div>
          <strong>Weight:</strong> {character.weight}
        </div>
        <div>
          <strong>Strength:</strong> {character.strength}
        </div>
        <div>
          <strong>Dexterity:</strong> {character.dexterity}
        </div>
        <div>
          <strong>Constitution:</strong> {character.constitution}
        </div>
        <div>
          <strong>Intelligence:</strong> {character.intelligence}
        </div>
        <div>
          <strong>Wisdom:</strong> {character.wisdom}
        </div>
        <div>
          <strong>Charisma:</strong> {character.charisma}
        </div>
        <div>
          <strong>Armor Class:</strong> {character.armorClass}
        </div>
        <div>
          <strong>Hit Points:</strong> {character.hitPoints} / {character.maxHitPoints}
        </div>
        <div>
          <strong>Max Hit Points:</strong> {character.maxHitPoints}
        </div>
        <div>
          <strong>Initiative:</strong> {character.initiative}
        </div>
        <div>
          <strong>Base Attack Bonus:</strong> {character.baseAttackBonus}
        </div>
        <div>
          <strong>Fortitude:</strong> {character.savingThrows.fortitude}
        </div>
        <div>
          <strong>Reflex:</strong> {character.savingThrows.reflex}
        </div>
        <div>
          <strong>Will:</strong> {character.savingThrows.will}
        </div>
      </div>
    </div>
  );
};

export default CharacterSheet;
