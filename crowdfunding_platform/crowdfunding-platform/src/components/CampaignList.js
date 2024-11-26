import React, { useEffect, useState } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants";

const CampaignList = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [web3, setWeb3] = useState(null);

  // Initialize web3 only once
  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
    }
  }, []); // Empty array to run only once

  useEffect(() => {
    const loadCampaigns = async () => {
      if (!web3) return; // Ensure web3 is initialized before making contract calls
  
      const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
  
      try {
        const projectCount = await contract.methods.projectCount().call();
        console.log("Project count:", projectCount); // Debugging project count
  
        const campaignData = [];
        for (let i = 1; i <= projectCount; i++) {
          const project = await contract.methods.getProject(i).call();
          console.log("Project", i, ":", project); // Debugging project data
          campaignData.push(project);
        }
        setCampaigns(campaignData);
      } catch (error) {
        console.error("Error loading campaigns:", error);
      }
    };
  
    if (web3) {
      loadCampaigns();
    }
  }, [web3]); // Only run when web3 is initialized
  
  return (
    <div>
      <h2>Campaigns</h2>
      <ul>
        {campaigns.map((campaign, index) => (
          <li key={index}>
            <h3>{campaign.title}</h3>
            <p>{campaign.description}</p>
            <p>Goal: {web3.utils.fromWei(campaign.fundingGoal)} ETH</p>
            <p>Funded: {web3.utils.fromWei(campaign.totalFunded)} ETH</p>
            <p>Status: {campaign.isCompleted ? "Completed" : "Ongoing"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CampaignList;
