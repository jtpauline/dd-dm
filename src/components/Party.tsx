import React, { useState, useEffect } from 'react';
    import CharacterForm from './CharacterForm';
    import CharacterSheet from './CharacterSheet';
    import CharacterList from './CharacterList';
    import { feats } from '../lib/data';

    interface Character {
      id: string;
      name: string;
      race: string;
      alignment: string;
      class: string;
      level: number;
      deity: string;
      playerName: string; // Added playerName
      height: string;    // Added height
      weight: string;    // Added weight
      strength: number;
      dexterity: number;
      constitution: number;
      intelligence: number;
      wisdom: number;
      charisma: number;
      armorClass: number; // Added armorClass
      hitPoints: number;
      maxHitPoints: number;
      initiative: number;
      baseAttackBonus: number;
      savingThrows: {
        fortitude: number;
        reflex: number;
        will: number;
      };
      skills: Record<string, number>;
      feats: string[];
    }

    const Party = () => {
      const [characters, setCharacters] = useState<Character[]>(() => {
        const storedCharacters = localStorage.getItem('characters');
        return storedCharacters ? JSON.parse(storedCharacters) : [];
      });
      const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

      // Removed availableSkillPoints and availableFeats state and related useEffects

      const [newCharacter, setNewCharacter] = useState<Character>({ // Added initial values
        id: Date.now().toString(),
        name: '',
        race: 'Human',
        alignment: 'Neutral Good',
        class: 'Fighter',
        level: 1,
        deity: 'Pelor',
        playerName: '',
        height: '',
        weight: '',
        strength: 10,
        dexterity: 10,
        constitution: 10,
        intelligence: 10,
        wisdom: 10,
        charisma: 10,
        armorClass: 10,
        hitPoints: 1, // Initial HP
        maxHitPoints: 1, // Initial max HP
        initiative: 0,
        baseAttackBonus: 0,
        savingThrows: {
          fortitude: 0,
          reflex: 0,
          will: 0,
        },
        skills: {},
        feats: [],
      });

      useEffect(() => {
        localStorage.setItem('characters', JSON.stringify(characters));
      }, [characters]);

      const handleCreateCharacter = (newCharacterData: Character) => {
        const newCharacter = { ...newCharacterData, id: Date.now().toString() };
        setCharacters([...characters, newCharacter]);
        // Reset the form
        setNewCharacter({
          id: Date.now().toString(),
          name: '',
          race: 'Human',
          alignment: 'Neutral Good',
          class: 'Fighter',
          level: 1,
          deity: 'Pelor',
          playerName: '', // Added playerName
          height: '',    // Added height
          weight: '',    // Added weight
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10,
          armorClass: 10,
          hitPoints: 1, // Initial HP
          maxHitPoints: 1, // Initial max HP
          initiative: 0,
          baseAttackBonus: 0,
          savingThrows: {
            fortitude: 0,
            reflex: 0,
            will: 0,
          },
          skills: {},
          feats: [],
        });
      };

      const handleDeleteCharacter = (id: string) => {
        setCharacters(characters.filter((c) => c.id !== id));
        if (selectedCharacter?.id === id) {
          setSelectedCharacter(null);
        }
      };

      const handleSelectCharacter = (character: Character) => {
        setSelectedCharacter(character);
      };

      return (
        <div>
          <h2>Party</h2>
          <CharacterForm
            initialCharacter={newCharacter}
            onSubmit={handleCreateCharacter}
          />
          <CharacterList
            characters={characters}
            onSelectCharacter={handleSelectCharacter}
            onDeleteCharacter={handleDeleteCharacter}
          />
          {selectedCharacter && <CharacterSheet character={selectedCharacter} />}
        </div>
      );
    };

    export default Party;
    export { Character };
