import React from 'react';
    import { Character } from './Party';

    interface CharacterListProps {
      characters: Character[];
      onSelectCharacter: (character: Character) => void;
      onDeleteCharacter: (id: string) => void;
    }

    const CharacterList: React.FC<CharacterListProps> = ({ characters, onSelectCharacter, onDeleteCharacter }) => {
      return (
        <div>
          <h3>Characters</h3>
          <ul>
            {characters.map((character) => (
              <li key={character.id}>
                {character.name} - {character.class} (Level {character.level})
                <button onClick={() => onSelectCharacter(character)}>Select</button>
                <button onClick={() => onDeleteCharacter(character.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      );
    };

    export default CharacterList;
