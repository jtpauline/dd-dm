import React, { useState, useEffect } from 'react';
import { Dices } from 'lucide-react';

interface RollResult {
  roll: string;
  results: number[];
  total: number;
}

const DiceRoller = () => {
  const [rollInput, setRollInput] = useState('');
  const [rollHistory, setRollHistory] = useState<RollResult[]>(() => {
    const storedRolls = localStorage.getItem('rollHistory');
    return storedRolls ? JSON.parse(storedRolls) : [];
  });

  useEffect(() => {
    localStorage.setItem('rollHistory', JSON.stringify(rollHistory));
  }, [rollHistory]);

  const parseDiceNotation = (notation: string): { numDice: number; dieType: number; modifier: number } => {
    const match = notation.match(/(\d*)d(\d+)([+-]\d+)?/);
    if (!match) {
      throw new Error("Invalid dice notation");
    }

    const numDice = match[1] === '' ? 1 : parseInt(match[1], 10);
    const dieType = parseInt(match[2], 10);
    const modifier = match[3] ? parseInt(match[3], 10) : 0;

    return { numDice, dieType, modifier };
  };

  const rollDice = (diceNotation: string) => {
    try {
      const { numDice, dieType, modifier } = parseDiceNotation(diceNotation);
      const results: number[] = [];

      for (let i = 0; i < numDice; i++) {
        let roll = Math.floor(Math.random() * dieType) + 1;
        results.push(roll);
      }

      const total = results.reduce((sum, roll) => sum + roll, 0) + modifier;
      return { results, total };
    } catch (error: any) {
      alert(error.message);
      return null;
    }
  };

  const handleRoll = () => {
    const rolls = rollInput.split(',').map(roll => roll.trim());
    const newRolls: RollResult[] = [];

    rolls.forEach(roll => {
      const result = rollDice(roll);
      if (result) {
        newRolls.push({
          roll: roll,
          results: result.results,
          total: result.total,
        });
      }
    });

    setRollHistory(prevHistory => [...prevHistory, ...newRolls]);
    setRollInput('');
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      <h2 className="text-2xl font-bold mb-4 flex items-center">
        <Dices className="mr-2" /> Dice Roller
      </h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter dice notation (e.g., 2d6+3, 1d20)"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
          value={rollInput}
          onChange={(e) => setRollInput(e.target.value)}
        />
        <div className="mt-2 flex items-center">
          <button
            onClick={handleRoll}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          >
            Roll Dice
          </button>
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">Roll History:</h3>
        {rollHistory.length > 0 ? (
          <ul className="list-disc pl-5">
            {rollHistory.map((result, index) => (
              <li key={index} className="mb-1">
                <span className="font-bold">{result.roll}:</span>
                <span> Results: [{result.results.join(', ')}]</span>
                <span> Total: {result.total}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No rolls yet. Roll some dice!</p>
        )}
      </div>
      <button
        onClick={clearHistory}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        Clear History
      </button>
    </div>
  );
};

export default DiceRoller;
