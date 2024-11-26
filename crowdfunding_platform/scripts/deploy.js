const { ethers } = require("hardhat");

async function main() {
    // Get the deployer's wallet address
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Replace "CrowdfundingPlatform" with the exact name of your contract
    const CrowdFunding = await ethers.getContractFactory("CrowdfundingPlatform");

    // Deploy the contract
    const crowdFunding = await CrowdFunding.deploy();
    
    // Log the deployed contract address
    console.log("Crowdfunding contract deployed to:", crowdFunding.address);
}

// Run the main function and handle errors
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
