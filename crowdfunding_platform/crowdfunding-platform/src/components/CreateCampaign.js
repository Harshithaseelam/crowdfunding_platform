import React, { useState, useEffect } from "react";
import Web3 from "web3";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "../constants"; // Ensure you import your contract ABI and address

const CreateCampaign = () => {
  const [web3, setWeb3] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fundingGoal, setFundingGoal] = useState("");
  const [duration, setDuration] = useState("");
  const [beneficiary, setBeneficiary] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);
      window.ethereum.request({ method: "eth_requestAccounts" });
    }
  }, []);

  // Get the current user's Ethereum address from MetaMask
  const getUserAddress = async () => {
    if (web3) {
      const accounts = await web3.eth.getAccounts();
      return accounts[0]; // Return the first account in the array
    }
    return null; // Return null if no web3 instance or account is found
  };

  // Function to handle campaign creation
  const createCampaign = async () => {
    const userAddress = await getUserAddress();
    if (!userAddress) {
      console.error("User address not found!");
      return;
    }

    // Check if all form fields are filled
    if (!title || !description || !fundingGoal || !duration || !beneficiary) {
      console.error("Please fill in all fields");
      return;
    }

    const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

    try {
      await contract.methods.createProject(
        title,                                 // Title (string)
        description,                           // Description (string)
        web3.utils.toWei(fundingGoal, "ether"), // Funding goal (in Wei, uint256)
        duration,                              // Duration (uint256)
        beneficiary,                           // Beneficiary address (address)
        isCompleted                            // isCompleted (bool)
      ).send({ from: userAddress });

      console.log("Campaign created successfully!");
      alert("Campaign created successfully!");
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Error creating campaign. Please try again.");
    }
  };

  return (
    <div>
      <h2>Create a Campaign</h2>
      <form>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label>Funding Goal (ETH):</label>
          <input
            type="number"
            value={fundingGoal}
            onChange={(e) => setFundingGoal(e.target.value)}
          />
        </div>
        <div>
          <label>Duration (in days):</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>
        <div>
          <label>Beneficiary Address:</label>
          <input
            type="text"
            value={beneficiary}
            onChange={(e) => setBeneficiary(e.target.value)}
          />
        </div>
        <div>
          <label>Is Completed:</label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => setIsCompleted(!isCompleted)}
          />
        </div>
        <button type="button" onClick={createCampaign}>
          Create Campaign
        </button>
      </form>
    </div>
  );
};

export default CreateCampaign;
