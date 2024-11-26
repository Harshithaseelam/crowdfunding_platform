import React from "react";
import "./CampaignCard.css";

function CampaignCard({ campaign }) {
  return (
    <div className="campaign-card">
      <h3>{campaign.title}</h3>
      <p>Goal: {campaign.goal} ETH</p>
      <p>Funds Raised: {campaign.funds} ETH</p>
      <button>Contribute</button>
    </div>
  );
}

export default CampaignCard;
