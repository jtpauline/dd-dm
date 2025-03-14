import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import { Settings } from 'lucide-react';

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white">
      <h1 className="text-4xl font-bold mb-8">D&D 3.5 Dungeon Master Toolkit</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <FunctionTile title="Combat Tracker" description="Manage encounters and track combat." link="/combat-tracker" />
        <FunctionTile title="Campaign Management" description="Create and manage your campaigns." link="/campaigns" />
        <FunctionTile title="Party Management" description="Manage player characters and their stats." link="/party" />
        <FunctionTile title="Dice Roller" description="Roll dice for your D&D 3.5 game." link="/dice-roller" />
      </div>

      <button
        onClick={openModal}
        className="absolute top-4 right-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        <Settings className="h-5 w-5 inline-block mr-2" />
        Settings
      </button>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="Modal bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md mx-auto mt-20"
        overlayClassName="Overlay fixed top-0 left-0 w-full h-full bg-gray-500 opacity-75"
      >
        <h2 className="text-2xl font-bold mb-4 dark:text-white">Settings</h2>
        <p className="dark:text-gray-300">Here you can adjust settings for the toolkit.</p>
        <button
          onClick={closeModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
        >
          Close
        </button>
      </Modal>
    </div>
  );
};

const FunctionTile = ({ title, description, link }: { title: string; description: string; link: string }) => {
  return (
    <Link to={link} className="block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300">
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-700 dark:text-gray-300">{description}</p>
    </Link>
  );
};

export default LandingPage;
