import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

interface Condition {
  id: string;
  name: string;
}

interface Effect {
  id: string;
  name: string;
  duration: number;
  description: string;
  modifiers: {
    [key: string]: number;
  };
}

interface Combatant {
  id: string;
  idOriginalInitiative?: string;
  name: string;
  initiative: number;
  originalInitiative?: number;
  hitPoints: number;
  maxHitPoints: number;
  tempHitPoints: number;
  armorClass: number;
  conditions: Condition[];
  effects: Effect[];
  heldAction?: boolean;
  readyAction?: boolean;
  heldActionRounds?: number;
  readyActionRounds?: number;
  concentration?: number; // Concentration skill check bonus
  fortitudeSave?: number; // Fortitude saving throw bonus
  reflexSave?: number; // Reflex saving throw bonus
  willSave?: number; // Will saving throw bonus
}

const CombatTracker = () => {
  const [combatants, setCombatants] = useState<Combatant[]>(() => {
    try {
      const storedCombatants = localStorage.getItem('combatants');
      const parsedCombatants = storedCombatants ? JSON.parse(storedCombatants) : [];
      return Array.isArray(parsedCombatants) ? parsedCombatants.sort((a, b) => b.initiative - a.initiative) : [];
    } catch (error) {
      console.error("Error parsing combatants from localStorage:", error);
      return [];
    }
  });
  const [newCombatantName, setNewCombatantName] = useState('');
  const [newCombatantHP, setNewCombatantHP] = useState('');
  const [newCombatantAC, setNewCombatantAC] = useState('');
  const [newCombatantInitiative, setNewCombatantInitiative] = useState('');
  const [round, setRound] = useState(1);
  const [currentCombatantIndex, setCurrentCombatantIndex] = useState(0);
  const [availableConditions, setAvailableConditions] = useState<Condition[]>([
    { id: 'blinded', name: 'Blinded' },
    { id: 'dazed', name: 'Dazed' },
    { id: 'dazzled', name: 'Dazzled' },
    { id: 'deafened', name: 'Deafened' },
    { id: 'disabled', name: 'Disabled' },
    { id: 'dying', name: 'Dying' },
    { id: 'unconscious', name: 'Unconscious' },
    { id: 'energyDrained', name: 'Energy Drained' },
    { id: 'entangled', name: 'Entangled' },
    { id: 'exhausted', name: 'Exhausted' },
    { id: 'fatigued', name: 'Fatigued' },
    { id: 'fascinated', name: 'Fascinated' },
    { id: 'frightened', name: 'Frightened' },
    { id: 'cowering', name: 'Cowering' },
    { id: 'panicked', name: 'Panicked' },
    { id: 'flatFooted', name: 'Flat-Footed' },
    { id: 'grappling', name: 'Grappling' },
    { id: 'helpless', name: 'Helpless' },
    { id: 'incorporeal', name: 'Incorporeal' },
    { id: 'invisible', name: 'Invisible' },
    { id: 'nauseated', name: 'Nauseated' },
    { id: 'paralyzed', name: 'Paralyzed' },
    { id: 'petrified', name: 'Petrified' },
    { id: 'pinned', name: 'Pinned' },
    { id: 'prone', name: 'Prone' },
    { id: 'shaken', name: 'Shaken' },
    { id: 'sickened', name: 'Sickened' },
    { id: 'stable', name: 'Stable' },
    { id: 'staggered', name: 'Staggered' },
    { id: 'stunned', name: 'Stunned' },
  ]);
  const [availableEffects, setAvailableEffects] = useState<Effect[]>([
    {
      id: 'bless',
      name: 'Bless',
      duration: 1,
      description: 'Blesses the target',
      modifiers: {
        attackBonus: 1,
        savingThrowBonus: 1,
      },
    },
    {
      id: 'haste',
      name: 'Haste',
      duration: 3,
      description: 'Hastes the target',
      modifiers: {
        attackBonus: 1,
        armorClass: 1,
        movementSpeed: 30,
      },
    },
    {
      id: 'aid',
      name: 'Aid',
      duration: 1,
      description: 'Temporary HP +1 morale bonus on attacks and saves vs. fear.',
      modifiers: {
        tempHP: 1,
        attackBonus: 1,
        saveBonusFear: 1,
      },
    },
    {
      id: 'prayer',
      name: 'Prayer',
      duration: 1,
      description: '+1 luck bonus to attacks, damage, saves, and skills (allies); -1 for enemies.',
      modifiers: {
        attackBonus: 1,
        damageBonus: 1,
        saveBonus: 1,
        skillBonus: 1,
      },
    },
    {
      id: 'heroism',
      name: 'Heroism',
      duration: 1,
      description: '+2 morale bonus on attack rolls, saves, and skills.',
      modifiers: {
        attackBonus: 2,
        saveBonus: 2,
        skillBonus: 2,
      },
    },
    {
      id: 'greaterHeroism',
      name: 'Greater Heroism',
      duration: 1,
      description: '+4 morale bonus and temporary HP.',
      modifiers: {
        attackBonus: 4,
        saveBonus: 4,
        skillBonus: 4,
        tempHP: 1,
      },
    },
    {
      id: 'divineFavor',
      name: 'Divine Favor',
      duration: 1,
      description: '+1 to +3 luck bonus on attack and damage rolls.',
      modifiers: {
        attackBonus: 2,
        damageBonus: 2,
      },
    },
    {
      id: 'expeditiousRetreat',
      name: 'Expeditious Retreat',
      duration: 1,
      description: 'Doubles base land speed.',
      modifiers: {
        movementSpeed: 1,
      },
    },
    {
      id: 'freedomOfMovement',
      name: 'Freedom of Movement',
      duration: 1,
      description: 'Immunity to grappling, paralysis, and difficult terrain.',
      modifiers: {
        immunityGrappling: 1,
        immunityParalysis: 1,
        immunityDifficultTerrain: 1,
      },
    },
    {
      id: 'fly',
      name: 'Fly',
      duration: 1,
      description: 'Grants flying speed 60 ft. (good maneuverability).',
      modifiers: {
        flyingSpeed: 60,
      },
    },
    {
      id: 'overlandFlight',
      name: 'Overland Flight',
      duration: 1,
      description: 'Long-duration flight (40 ft. average maneuverability).',
      modifiers: {
        flyingSpeed: 40,
      },
    },
    {
      id: 'mageArmor',
      name: 'Mage Armor',
      duration: 1,
      description: '+4 armor bonus to AC.',
      modifiers: {
        armorClass: 4,
      },
    },
    {
      id: 'shield',
      name: 'Shield',
      duration: 1,
      description: '+4 shield bonus to AC, negates Magic Missile.',
      modifiers: {
        armorClass: 4,
        immunityMagicMissile: 1,
      },
    },
    {
      id: 'protectionFromEvil',
      name: 'Protection from Evil',
      duration: 1,
      description: '+2 deflection AC, +2 resistance saves, immunity to mind control.',
      modifiers: {
        armorClass: 2,
        saveBonus: 2,
        immunityMindControl: 1,
      },
    },
    {
      id: 'barkskin',
      name: 'Barkskin',
      duration: 1,
      description: '+2 to +5 enhancement bonus to natural armor.',
      modifiers: {
        naturalArmor: 3,
      },
    },
    {
      id: 'stoneskin',
      name: 'Stoneskin',
      duration: 1,
      description: 'DR 10/adamantine, absorbs damage.',
      modifiers: {
        damageResistance: 10,
      },
    },
    {
      id: 'greaterInvisibility',
      name: 'Greater Invisibility',
      duration: 1,
      description: 'Target stays invisible even when attacking.',
      modifiers: {
        invisibility: 1,
      },
    },
    {
      id: 'bullsStrength',
      name: 'Bull’s Strength',
      duration: 1,
      description: '+4 enhancement bonus to Strength.',
      modifiers: {
        strength: 4,
      },
    },
    {
      id: 'catsGrace',
      name: 'Cat’s Grace',
      duration: 1,
      description: '+4 enhancement bonus to Dexterity.',
      modifiers: {
        dexterity: 4,
      },
    },
    {
      id: 'bearsEndurance',
      name: 'Bear’s Endurance',
      duration: 1,
      description: '+4 enhancement bonus to Constitution.',
      modifiers: {
        constitution: 4,
      },
    },
    {
      id: 'owlsWisdom',
      name: 'Owl’s Wisdom',
      duration: 1,
      description: '+4 enhancement bonus to Wisdom.',
      modifiers: {
        wisdom: 4,
      },
    },
    {
      id: 'foxsCunning',
      name: 'Fox’s Cunning',
      duration: 1,
      description: '+4 enhancement bonus to Intelligence.',
      modifiers: {
        intelligence: 4,
      },
    },
    {
      id: 'eaglesSplendor',
      name: 'Eagle’s Splendor',
      duration: 1,
      description: '+4 enhancement bonus to Charisma.',
      modifiers: {
        charisma: 4,
      },
    },
    {
      id: 'righteousMight',
      name: 'Righteous Might',
      duration: 1,
      description: 'Increases size, Strength, and grants DR.',
      modifiers: {
        strength: 4,
        damageResistance: 5,
      },
    },
    {
      id: 'tensorsTransformation',
      name: 'Tenser’s Transformation',
      duration: 1,
      description: 'Turns a caster into a melee fighter (+4 Str, Dex, Con, and more).',
      modifiers: {
        strength: 4,
        dexterity: 4,
        constitution: 4,
      },
    },
    {
      id: 'magicWeapon',
      name: 'Magic Weapon',
      duration: 1,
      description: 'Weapon gains +1 enhancement bonus.',
      modifiers: {
        attackBonus: 1,
        damageBonus: 1,
      },
    },
    {
      id: 'greaterMagicWeapon',
      name: 'Greater Magic Weapon',
      duration: 1,
      description: '+1 to +5 enhancement bonus based on caster level.',
      modifiers: {
        attackBonus: 3,
        damageBonus: 3,
      },
    },
    {
      id: 'flameArrow',
      name: 'Flame Arrow',
      duration: 1,
      description: 'Gives arrows/firearms +1d6 fire damage.',
      modifiers: {
        fireDamage: 3.5,
      },
    },
    {
      id: 'holySword',
      name: 'Holy Sword',
      duration: 1,
      description: 'Grants a weapon +5 enhancement and extra damage against evil creatures.',
      modifiers: {
        attackBonus: 5,
        damageBonus: 5,
        extraDamageEvil: 7,
      },
    },
    {
      id: 'vigorLesser',
      name: 'Lesser Vigor',
      duration: 1,
      description: 'Fast healing over time.',
      modifiers: {
        hitPointsRegen: 1,
      },
    },
    {
      id: 'vigorRegular',
      name: 'Regular Vigor',
      duration: 1,
      description: 'Fast healing over time.',
      modifiers: {
        hitPointsRegen: 2,
      },
    },
    {
      id: 'vigorGreater',
      name: 'Greater Vigor',
      duration: 1,
      description: 'Fast healing over time.',
      modifiers: {
        hitPointsRegen: 4,
      },
    },
    {
      id: 'regenerate',
      name: 'Regenerate',
      duration: 1,
      description: 'Restores lost limbs and HP.',
      modifiers: {
        hitPointsRegen: 5,
      },
    },
    {
      id: 'heal',
      name: 'Heal',
      duration: 1,
      description: 'Restores HP fully (except ability drain and negative levels).',
      modifiers: {
        hitPointsRestore: 1,
      },
    },
    {
      id: 'mindBlank',
      name: 'Mind Blank',
      duration: 1,
      description: 'Immunity to all mind-affecting effects.',
      modifiers: {
        immunityMindEffects: 1,
      },
    },
    {
      id: 'momentOfPrescience',
      name: 'Moment of Prescience',
      duration: 1,
      description: 'One-time massive bonus to a roll of choice.',
      modifiers: {
        skillBonus: 20,
      },
    },
    {
      id: 'trueSeeing',
      name: 'True Seeing',
      duration: 1,
      description: 'Sees through illusions and magical deception.',
      modifiers: {
        trueSeeing: 1,
      },
    },
  ]);
  const [newEffectName, setNewEffectName] = useState('');
  const [newEffectDuration, setNewEffectDuration] = useState('');
  const [newEffectDescription, setNewEffectDescription] = useState('');
  const [newEffectModifiers, setNewEffectModifiers] = useState('');
  const [tiedInitiativeValue, setTiedInitiativeValue] = useState('');
  const [selectedCombatantForTie, setSelectedCombatantForTie] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('combatants', JSON.stringify(combatants));
  }, [combatants]);

  const handleNextTurn = useCallback(() => {
    if (!combatants || combatants.length === 0) {
      return;
    }

    setCurrentCombatantIndex((prevIndex) => {
      let nextIndex = (prevIndex + 1) % combatants.length;
      let loops = 0;
      while ((combatants[nextIndex]?.heldAction && combatants[nextIndex]?.heldActionRounds !== 0) ||
             (combatants[nextIndex]?.readyAction && combatants[nextIndex]?.readyActionRounds !== 0)) {
        if (loops >= combatants.length) break;
        nextIndex = (nextIndex + 1) % combatants.length;
        loops++;
      }
      return nextIndex;
    });

    setCombatants(prevCombatants => {
      return (prevCombatants ?? []).map(combatant => {
        let updatedCombatant = { ...combatant };

        if (combatant.heldAction && combatant.heldActionRounds && combatant.heldActionRounds > 0) {
          updatedCombatant = { ...updatedCombatant, heldActionRounds: combatant.heldActionRounds - 1 };
          if (updatedCombatant.heldActionRounds <= 0) {
            updatedCombatant = { ...updatedCombatant, heldAction: false, heldActionRounds: 0 };
          }
        }

        if (combatant.readyAction && combatant.readyActionRounds && combatant.readyActionRounds > 0) {
          updatedCombatant = { ...updatedCombatant, readyActionRounds: combatant.readyActionRounds - 1 };
          if (updatedCombatant.readyActionRounds <= 0) {
            updatedCombatant = { ...updatedCombatant, readyAction: false, readyActionRounds: 0 };
          }
        }

        // Decrement effect durations
        updatedCombatant.effects = updatedCombatant.effects.map(effect => ({
          ...effect,
          duration: effect.duration - 1,
        })).filter(effect => effect.duration > 0);

        return updatedCombatant;
      });
    });

    if (combatants.length > 0 && (currentCombatantIndex + 1) % combatants.length === 0) {
      setRound((prevRound) => prevRound + 1);
    }
  }, [combatants, currentCombatantIndex]);

  const handlePreviousTurn = useCallback(() => {
    setCurrentCombatantIndex((prevIndex) => {
      let previousIndex = (prevIndex - 1 + ((combatants ?? []).length ?? 0)) % ((combatants ?? []).length ?? 1);
      let loops = 0;
      while ((combatants[previousIndex]?.heldAction && combatants[previousIndex]?.heldActionRounds !== 0) ||
             (combatants[previousIndex]?.readyAction && combatants[previousIndex]?.readyActionRounds !== 0)) {
        if (loops >= ((combatants ?? []).length ?? 0)) break;
        previousIndex = (previousIndex - 1 + ((combatants ?? []).length ?? 0)) % ((combatants ?? []).length ?? 1);
        loops++;
      }
      return previousIndex;
    });

    if (currentCombatantIndex === 0) {
      setRound((prevRound) => Math.max(1, prevRound - 1));
    }
  }, [combatants, currentCombatantIndex]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (document.activeElement instanceof HTMLInputElement) {
        return;
      }

      if (event.key === 'ArrowRight') {
        handleNextTurn();
      } else if (event.key === 'ArrowLeft') {
        handlePreviousTurn();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNextTurn, handlePreviousTurn]);

  const addCombatant = () => {
    if (!newCombatantName.trim() || !newCombatantHP.trim() || !newCombatantAC.trim() || !newCombatantInitiative.trim()) {
      alert("Please fill in all the fields.");
      return;
    }

    const hp = parseInt(newCombatantHP, 10);
    const ac = parseInt(newCombatantAC, 10);
    const initiative = parseInt(newCombatantInitiative, 10);

    if (isNaN(hp) || isNaN(ac) || isNaN(initiative)) {
      alert("HP, AC, and Initiative must be valid numbers.");
      return;
    }

    const newCombatant: Combatant = {
      id: uuidv4(),
      name: newCombatantName,
      initiative: initiative,
      originalInitiative: initiative,
      hitPoints: hp,
      maxHitPoints: hp,
      tempHitPoints: 0,
      armorClass: ac,
      conditions: [],
      effects: [],
      heldAction: false,
      readyAction: false,
      heldActionRounds: 0,
      readyActionRounds: 0,
      concentration: 0,
      fortitudeSave: 0,
      reflexSave: 0,
      willSave: 0,
    };

    const updatedCombatants = [...(combatants ?? []), newCombatant].sort((a, b) => b.initiative - a.initiative);
    setCombatants(updatedCombatants);
    setNewCombatantName('');
    setNewCombatantHP('');
    setNewCombatantAC('');
    setNewCombatantInitiative('');
  };

  const removeCombatant = (id: string) => {
    setCombatants((combatants ?? []).filter((combatant) => combatant.id !== id));
  };

  const updateCombatantInitiative = (id: string, initiative: number) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === id ? { ...combatant, initiative: initiative } : combatant
      ).sort((a, b) => b.initiative - a.initiative)
    );
  };

  const sortCombatants = () => {
    const sortedCombatants = [...(combatants ?? [])].sort((a, b) => {
    return b.initiative - a.initiative;
    });
    setCombatants(sortedCombatants);
  };

  useEffect(() => {
    const sortedCombatants = [...(combatants ?? [])].sort((a, b) => b.initiative - a.initiative);
    setCombatants(sortedCombatants);
  }, []);

  const applyDamage = (id: string, damage: number) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) => {
        if (combatant.id === id) {
          const remainingTempHP = combatant.tempHitPoints > 0 ? combatant.tempHitPoints - damage : 0;
          const remainingDamage = combatant.tempHitPoints > 0 ? Math.max(0, damage - combatant.tempHitPoints) : damage;
          const newHitPoints = Math.max(0, combatant.hitPoints - remainingDamage);
          return {
            ...combatant,
            hitPoints: newHitPoints,
            tempHitPoints: remainingTempHP,
          };
        } else {
          return combatant;
        }
      })
    );
  };

  const applyHealing = (id: string, healing: number) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === id ? { ...combatant, hitPoints: Math.min(combatant.maxHitPoints, combatant.hitPoints + healing) } : combatant
      )
    );
  };

  const applyTempHP = (id: string, tempHP: number) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === id ? { ...combatant, tempHitPoints: tempHP } : combatant
      )
    );
  };

  const addCondition = (combatantId: string, condition: Condition) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === combatantId
          ? {
            ...combatant,
            conditions: [...combatant.conditions, condition],
          }
          : combatant
      )
    );
  };

  const removeCondition = (combatantId: string, conditionId: string) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) => ({
        ...combatant,
        conditions: combatant.conditions.filter((condition) => condition.id !== conditionId),
      }))
    );
  };

  const addEffect = (combatantId: string, effect: Effect) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === combatantId
          ? {
            ...combatant,
            effects: [...combatant.effects, effect],
          }
          : combatant
      )
    );
  };

  const removeEffect = (combatantId: string, effectId: string) => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) => ({
        ...combatant,
        effects: combatant.effects.filter((effect) => effect.id !== effectId),
      }))
    );
  };

  const resetRound = () => {
    setRound(1);
    setCurrentCombatantIndex(0);
  };

  const endEncounter = () => {
    setCombatants([]);
    setRound(1);
    setCurrentCombatantIndex(0);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination || !combatants) {
      return;
    }

    const startIndex = result.source.index;
    const endIndex = result.destination.index;

    const reorderedCombatants = [...(combatants ?? [])];
    const [removed] = reorderedCombatants.splice(startIndex, 1);
    reorderedCombatants.splice(endIndex, 0, removed);

    setCombatants(reorderedCombatants);
    setCurrentCombatantIndex(endIndex);
  };

  const handleTieInitiative = () => {
    if (!tiedInitiativeValue.trim() || !selectedCombatantForTie) {
      alert("Please enter a valid initiative value and select a combatant.");
      return;
    }

    const initiativeValue = parseInt(tiedInitiativeValue, 10);

    if (isNaN(initiativeValue)) {
      alert("Initiative must be a valid number.");
      return;
    }

    setCombatants((prevCombatants) => {
      return (prevCombatants ?? []).map((combatant) => {
        if (combatant.id === selectedCombatantForTie) {
          return {
            ...combatant,
            initiative: initiativeValue,
          };
        }
        return combatant;
      }).sort((a, b) => b.initiative - a.initiative);
    });

    setTiedInitiativeValue('');
    setSelectedCombatantForTie(null);
  };

  const toggleHoldAction = (id: string, rounds: number) => {
    if (isNaN(rounds) || rounds <= 0) {
      alert("Please enter a valid number of rounds.");
      return;
    }

    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === id ? { ...combatant, heldAction: true, heldActionRounds: rounds } : combatant
      )
    );
  };

  const toggleReadyAction = (id: string, rounds: number) => {
    if (isNaN(rounds) || rounds <= 0) {
      alert("Please enter a valid number of rounds.");
      return;
    }

    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === id ? { ...combatant, readyAction: true, readyActionRounds: rounds } : combatant
      )
    );
  };

  const clearAction = (id: string, actionType: 'heldAction' | 'readyAction') => {
    setCombatants((prevCombatants) =>
      (prevCombatants ?? []).map((combatant) =>
        combatant.id === id ? { ...combatant, [actionType]: false, [`${actionType}Rounds`]: 0 } : combatant
      )
    );
  };

  console.log("Combatants state:", combatants);

  return (
    <div className="container mx-auto p-4 dark:bg-gray-800 dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Combat Tracker</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Add New Combatant</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="text"
            placeholder="Combatant Name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            value={newCombatantName}
            onChange={(e) => setNewCombatantName(e.target.value)}
          />
          <input
            type="number"
            placeholder="HP"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            value={newCombatantHP}
            onChange={(e) => setNewCombatantHP(e.target.value)}
          />
          <input
            type="number"
            placeholder="AC"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            value={newCombatantAC}
            onChange={(e) => setNewCombatantAC(e.target.value)}
          />
           <input
            type="number"
            placeholder="Initiative"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            value={newCombatantInitiative}
            onChange={(e) => setNewCombatantInitiative(e.target.value)}
          />
          <button onClick={addCombatant} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Add Combatant
          </button>
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Round: {round}</h2>
        <button onClick={handlePreviousTurn} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
          Previous Turn
        </button>
        <button onClick={handleNextTurn} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
          Next Turn
        </button>
        <button onClick={resetRound} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
          Reset Round
        </button>
        <button onClick={endEncounter} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          End Encounter
        </button>
        <button onClick={sortCombatants} className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Sort
        </button>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Tie Initiative</h2>
        <div className="flex flex-col md:flex-row gap-2">
          <input
            type="number"
            placeholder="Initiative Value"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            value={tiedInitiativeValue}
            onChange={(e) => setTiedInitiativeValue(e.target.value)}
          />
          <select
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
            onChange={(e) => setSelectedCombatantForTie(e.target.value)}
            value={selectedCombatantForTie || ''}
          >
            <option value="" disabled>Select Combatant</option>
            {(combatants ?? []).map((combatant) => (
              <option key={combatant.id} value={combatant.id}>
                {combatant.name}
              </option>
            ))}
          </select>
          <button onClick={handleTieInitiative} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Tie Initiative
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="combatants">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} className="mb-4">
              {(combatants ?? []).map((combatant, index) => (
                <Draggable key={combatant.id} draggableId={combatant.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`mb-2 p-4 rounded shadow-md ${combatant.id === combatants[currentCombatantIndex]?.id ? 'bg-green-200 dark:bg-green-700' : 'bg-gray-100dark:bg-gray-700'} flex items-center justify-between`}
                    >
                      <div>
                        <span className="font-bold">{combatant.name}</span>
                        <div className="mt-2">
                          Initiative: {combatant.initiative}
                          {combatant.originalInitiative !== combatant.initiative && (
                            <span> (Original: {combatant.originalInitiative})</span>
                          )}
                        </div>
                        <div className="mt-2">
                          HP: {combatant.hitPoints} / {combatant.maxHitPoints} Temp HP: {combatant.tempHitPoints} AC: {combatant.armorClass}
                        </div>
                         <div className="mt-2">
                          Concentration: {combatant.concentration} Fortitude: {combatant.fortitudeSave} Reflex: {combatant.reflexSave} Will: {combatant.willSave}
                        </div>
                        <div className="flex items-center mt-2">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mr-2"
                            placeholder="Damage"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value, 10);
                                if (!isNaN(value)) {
                                  applyDamage(combatant.id, value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <button onClick={() => {
                            const damageInput = document.querySelector(`input[placeholder="Damage"]`) as HTMLInputElement;
                            if (damageInput) {
                              const value = parseInt(damageInput.value, 10);
                              if (!isNaN(value)) {
                                applyDamage(combatant.id, value);
                                damageInput.value = '';
                              }
                            }
                          }} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Apply Damage
                          </button>
                        </div>
                        <div className="flex items-center mt-2">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mr-2"
                            placeholder="Healing"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value, 10);
                                if (!isNaN(value)) {
                                  applyHealing(combatant.id, value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <button onClick={() => {
                            const healingInput = document.querySelector(`input[placeholder="Healing"]`) as HTMLInputElement;
                            if (healingInput) {
                              const value = parseInt(healingInput.value, 10);
                              if (!isNaN(value)) {
                                applyHealing(combatant.id, value);
                                healingInput.value = '';
                              }
                            }
                          }} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Apply Healing
                          </button>
                        </div>
                        <div className="flex items-center mt-2">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mr-2"
                            placeholder="Temp HP"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseInt((e.target as HTMLInputElement).value, 10);
                                if (!isNaN(value)) {
                                  applyTempHP(combatant.id, value);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <button onClick={() => {
                            const tempHPInput = document.querySelector(`input[placeholder="Temp HP"]`) as HTMLInputElement;
                            if (tempHPInput) {
                              const value = parseInt(tempHPInput.value, 10);
                              if (!isNaN(value)) {
                                applyTempHP(combatant.id, value);
                                tempHPInput.value = '';
                              }
                            }
                          }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Apply Temp HP
                          </button>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-lg font-semibold">Conditions:</h3>
                          <ul className="flex flex-wrap">
                            {(combatant.conditions ?? []).map((condition) => (
                                <li key={condition.id} className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 mr-2 mt-2 flex items-center">
                                  {condition.name}
                                  <button
                                    onClick={() => removeCondition(combatant.id, condition.id)}
                                    className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                    aria-label={`Remove condition ${condition.name} from ${combatant.name}`}
                                  >
                                    X
                                  </button>
                                </li>
                              ))}
                          </ul>
                          <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mt-2"
                            onChange={(e) => {
                              const conditionId = e.target.value;
                              if (conditionId) {
                                const condition = availableConditions.find((c) => c.id === conditionId);
                                if (condition) {
                                  addCondition(combatant.id, condition);
                                }
                                (e.target as HTMLSelectElement).value = '';
                              }
                            }}
                            defaultValue=""
                            aria-label="Add condition"
                          >
                            <option value="" disabled>Add Condition</option>
                            {availableConditions.map((condition) => (
                              <option key={condition.id} value={condition.id}>
                                {condition.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-2">
                          <h3 className="text-lg font-semibold">Effects:</h3>
                          <ul className="flex flex-wrap">
                            {(combatant.effects ?? []).map((effect) => (
                              <li key={effect.id} className="bg-green-200 dark:bg-green-600 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 mr-2 mt-2 flex items-center">
                                {effect.name} ({effect.duration} rounds)
                                <button
                                  onClick={() => removeEffect(combatant.id, effect.id)}
                                  className="ml-2 text-red-500 hover:text-red-700 focus:outline-none"
                                  aria-label={"Remove effect " + effect.name + " from " + combatant.name}
                                >
                                  X
                                </button>
                              </li>
                            ))}
                          </ul>
                          <select
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mt-2"
                            onChange={(e) => {
                              const effectId = e.target.value;
                              if (effectId) {
                                const effect = availableEffects.find((c) => c.id === effectId);
                                if (effect) {
                                  addEffect(combatant.id, effect);
                                }
                                (e.target as HTMLSelectElement).value = '';
                              }
                            }}
                            defaultValue=""
                            aria-label="Add effect"
                          >
                            <option value="" disabled>Add Effect</option>
                            {availableEffects.map((effect) => (
                              <option key={effect.id} value={effect.id}>
                                {effect.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="mt-2 flex gap-2">
                          <input
                            type="number"
                            className="shadow appearance-none border rounded w-32 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white mr-2"
                            placeholder="Rounds"
                          />
                          <button
                            onClick={() => {
                              const roundsInput = document.querySelector(`input[placeholder="Rounds"]`) as HTMLInputElement;
                              if (roundsInput) {
                                const rounds = parseInt(roundsInput.value, 10);
                                toggleHoldAction(combatant.id, rounds);
                                roundsInput.value = '';
                              }
                            }}
                            className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${combatant.heldAction ? 'opacity-50' : ''}`}
                            disabled={combatant.heldAction}
                          >
                            {combatant.heldAction ? `Holding (${combatant.heldActionRounds} rounds)` : 'Hold Action'}
                          </button>
                          <input
                            type="number"
                            className="shadow appearance-none border rounded w-32 py-2 px-3text-gray-700 leading-tight focus-none focus:shadow-outline dark:bg-gray-700 dark:text-white mr-2"
                            placeholder="Rounds"
                          />
                          <button
                            onClick={() => {
                              const roundsInput = document.querySelectorAll(`input[placeholder="Rounds"]`)[1] as HTMLInputElement;
                              if (roundsInput) {
                                const rounds = parseInt(roundsInput.value, 10);
                                toggleReadyAction(combatant.id, rounds);
                                roundsInput.value = '';
                              }
                            }}
                            className={`bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${combatant.readyAction ? 'opacity-50' : ''}`}
                            disabled={combatant.readyAction}
                          >
                            {combatant.readyAction ? `Readying (${combatant.readyActionRounds} rounds)` : 'Ready Action'}
                          </button>
                          {(combatant.heldAction || combatant.readyAction) && (
                            <button
                              onClick={() => {
                                if (combatant.heldAction) {
                                  clearAction(combatant.id, 'heldAction');
                                } else if (combatant.readyAction) {
                                  clearAction(combatant.id, 'readyAction');
                                }
                              }}
                              className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                              Clear Action
                            </button>
                          )}
                        </div>
                      </div>
                      <button onClick={() => removeCombatant(combatant.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        Remove
                      </button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default CombatTracker;
