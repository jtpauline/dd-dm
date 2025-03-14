import React, { useState } from 'react';
import { Moon, Sun } from 'lucide-react';
// Attempt explicit import - This may not work, but it's worth a try
// import { Dice5 } from 'lucide-react/dist/esm/icons/dice-5'; // This line is commented out
// Fallback to a more common icon if the above fails.
import { Menu } from 'lucide-react';
import { cn } from '../lib/utils';

const Dashboard = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={cn(
      "min-h-screen",
      darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900",
      "transition-colors duration-300"
    )}>
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            {/* Use Menu as a fallback */}
            <Menu className="mr-2" />
            <h1 className="text-xl font-semibold">D&D 3.5 DM Toolkit</h1>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>
      </header>

      <main className="container mx-auto py-6 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Campaign Management</h2>
            <p>Manage your campaigns, sessions, and world details.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Player & NPC Management</h2>
            <p>Track player characters, NPCs, and their relationships.</p>
          </div>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-2">Monster & Combat</h2>
            <p>Access monster stats, manage encounters, and run combat.</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
