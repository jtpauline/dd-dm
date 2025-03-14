import React, { useState, useEffect } from 'react';

interface CampaignType {
  id: string;
  name: string;
}

const Campaign = () => {
  const [campaigns, setCampaigns] = useState<CampaignType[]>(() => {
    const storedCampaigns = localStorage.getItem('campaigns');
    return storedCampaigns ? JSON.parse(storedCampaigns) : [];
  });
  const [newCampaignName, setNewCampaignName] = useState('');

  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  const handleCampaignNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewCampaignName(event.target.value);
  };

  const handleCreateCampaign = (event: React.FormEvent) => {
    event.preventDefault();
    if (newCampaignName.trim() !== '') {
      const newCampaign: CampaignType = {
        id: Date.now().toString(),
        name: newCampaignName.trim(),
      };
      setCampaigns([...campaigns, newCampaign]);
      setNewCampaignName('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">Campaign Management</h1>

      {/* Campaign List */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Current Campaigns</h2>
        <ul className="list-disc pl-5">
          {campaigns.map((campaign) => (
            <li key={campaign.id}>
              <a href="#" className="text-blue-600 hover:underline dark:text-blue-400">
                {campaign.name}
              </a>
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Campaign */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Add New Campaign</h2>
        <form onSubmit={handleCreateCampaign}>
          <div className="mb-2">
            <label htmlFor="campaignName" className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-1">
              Campaign Name:
            </label>
            <input
              type="text"
              id="campaignName"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:bg-gray-800 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Enter campaign name"
              value={newCampaignName}
              onChange={handleCampaignNameChange}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Create Campaign
          </button>
        </form>
      </div>

      {/* Campaign Details (Example) */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Campaign Details</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Click on a campaign to view its details and manage sessions, characters, and world information.
        </p>
      </div>
    </div>
  );
};

export default Campaign;
