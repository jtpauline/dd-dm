import React, { useState, useEffect } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import CombatTracker from './components/CombatTracker';
import LandingPage from './components/LandingPage';
import Campaign from './components/Campaign';
import Settings from './components/Settings';
import ErrorBoundary from './components/ErrorBoundary';
import { logError } from './lib/utils';
import { BrowserRouter } from 'react-router-dom';
import Party from './components/Party';
import DiceRoller from './components/DiceRoller';

function App() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      logError('Unhandled promise rejection', event.reason);
      setError(new Error('Unhandled promise rejection'));
      event.preventDefault();
    };

    const handleError = (error: ErrorEvent) => {
      console.error('Unhandled error:', error.error);
      logError('Unhandled error', error.error);
      setError(error.error);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
    };
  }, []);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
        <h1 className="text-4xl font-bold mb-4">Oops! Something went wrong.</h1>
        <p className="text-lg mb-8">
          We've logged the error and are working to fix it. Please try refreshing the page.
        </p>
        <Link to="/" className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-300">
          Go back to the Landing Page
        </Link>
      </div>
    );
  }

  return (
    <div className="dark">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/combat-tracker" element={<CombatTracker />} />
        <Route path="/campaigns" element={<Campaign />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/party" element={<Party />} />
        <Route path="/dice-roller" element={<DiceRoller />} />
      </Routes>
    </div>
  );
}

export default App;
