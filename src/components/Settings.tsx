import React, { useState, useEffect } from 'react';

const Settings = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.className = theme;
  }, [theme]);

  const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md p-6 w-full md:w-3/4 lg:w-1/2 mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">Settings</h2>

      <div className="mb-4">
        <label htmlFor="theme" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
          Theme:
        </label>
        <select
          id="theme"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:text-white"
          value={theme}
          onChange={handleThemeChange}
          aria-label="Select theme"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>
    </div>
  );
};

export default Settings;
