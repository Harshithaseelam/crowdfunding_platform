import { ethers } from "ethers";
import contractABI from "./CrowdfundingPlatform.json";

const contractAddress = "YOUR_DEPLOYED_CONTRACT_ADDRESS";

export const getContract = () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI.abi, signer);
};
