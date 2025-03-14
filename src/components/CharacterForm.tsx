import React, { useState, useEffect } from 'react';
    import { savingThrowBaseValues, baseAttackBonusPerClass } from '../lib/data';
    import { getAbilityModifier, getHitDie } from '../lib/utils';

    interface CharacterFormProps {
      initialCharacter: any;
      onSubmit: (character: any) => void;
    }

    const CharacterForm: React.FC<CharacterFormProps> = ({ initialCharacter, onSubmit }) => {
      const [character, setCharacter] = useState(initialCharacter);

      useEffect(() => {
        setCharacter(initialCharacter);
      }, [initialCharacter]);

      const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCharacter(prevCharacter => ({
          ...prevCharacter,
          [name]: name === 'level' || name === 'strength' || name === 'dexterity' || name === 'constitution' || name === 'intelligence' || name === 'wisdom' || name === 'charisma' ? Number(value) : value,
        }));
      };

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const savingThrows = savingThrowBaseValues[character.class];
        const baseAttackBonus = baseAttackBonusPerClass[character.class][character.level - 1];

        const fortitudeModifier = getAbilityModifier(character.constitution);
        const reflexModifier = getAbilityModifier(character.dexterity);
        const willModifier = getAbilityModifier(character.wisdom);

        const fortitude = savingThrows.fortitude + fortitudeModifier;
        const reflex = savingThrows.reflex + reflexModifier;
        const will = savingThrows.will + willModifier;

        const hitDie = getHitDie(character.class);
        const constitutionModifier = getAbilityModifier(character.constitution);
        let maxHitPoints = hitDie + constitutionModifier;
        if (character.level > 1) {
          for (let i = 2; i <= character.level; i++) {
            maxHitPoints += Math.max(1, Math.floor(Math.random() * hitDie) + 1 + constitutionModifier); // Roll hit die + Con modifier
          }
        }
        maxHitPoints = Math.max(1, maxHitPoints);

        const updatedCharacter = {
          ...character,
          savingThrows: {
            fortitude,
            reflex,
            will,
          },
          baseAttackBonus,
          maxHitPoints,
          hitPoints: maxHitPoints,
        };

        onSubmit(updatedCharacter);
      };

      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={character.name}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="class" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Class</label>
            <select
              id="class"
              name="class"
              value={character.class}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="Fighter">Fighter</option>
              <option value="Rogue">Rogue</option>
              <option value="Wizard">Wizard</option>
              <option value="Cleric">Cleric</option>
              <option value="Barbarian">Barbarian</option>
              <option value="Bard">Bard</option>
              <option value="Druid">Druid</option>
              <option value="Monk">Monk</option>
              <option value="Paladin">Paladin</option>
              <option value="Ranger">Ranger</option>
              <option value="Sorcerer">Sorcerer</option>

            </select>
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Level</label>
            <input
              type="number"
              id="level"
              name="level"
              value={character.level}
              onChange={handleInputChange}
              min="1"
              max="20"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="race" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Race</label>
            <input
              type="text"
              id="race"
              name="race"
              value={character.race}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="alignment" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Alignment</label>
            <input
              type="text"
              id="alignment"
              name="alignment"
              value={character.alignment}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="deity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Deity</label>
            <input
              type="text"
              id="deity"
              name="deity"
              value={character.deity}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Add similar input fields for other character attributes */}
          <div>
            <label htmlFor="strength" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Strength</label>
            <input
              type="number"
              id="strength"
              name="strength"
              value={character.strength}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="dexterity" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dexterity</label>
            <input
              type="number"
              id="dexterity"
              name="dexterity"
              value={character.dexterity}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="constitution" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Constitution</label>
            <input
              type="number"
              id="constitution"
              name="constitution"
              value={character.constitution}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="intelligence" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Intelligence</label>
            <input
              type="number"
              id="intelligence"
              name="intelligence"
              value={character.intelligence}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="wisdom" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Wisdom</label>
            <input
              type="number"
              id="wisdom"
              name="wisdom"
              value={character.wisdom}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="charisma" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Charisma</label>
            <input
              type="number"
              id="charisma"
              name="charisma"
              value={character.charisma}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button type="submit" className="bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-75">
            Create Character
          </button>
        </form>
      );
    };

    export default CharacterForm;
