import React from 'react';
import CreateCampaign from './components/CreateCampaign';
import CampaignList from './components/CampaignList';

function App() {
  return (
    <div className="App">
      <h1>Crowdfunding Platform</h1>
      <CreateCampaign />
      <CampaignList />
    </div>
  );
}

export default App;
