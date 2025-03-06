/**
 * React component for the Voting System application.
 *
 * @component
 * @returns {JSX.Element} The rendered component.
 */

 /**
 * Initializes the blockchain connection and fetches candidate data.
 * 
 * @function
 * @name loadBlockchain
 * @async
 * @returns {Promise<void>}
 */

 /**
 * Handles the voting process for a candidate.
 *
 * @function
 * @name vote
 * @async
 * @param {number} id - The ID of the candidate to vote for.
 * @returns {Promise<void>}
 */
import { useState, useEffect } from "react";
import { BrowserProvider, Contract } from "ethers";

const contractAddress = "CONTRACT_ADDRESS";
const abi = [
  "function addCandidate(string memory _name) public",
  "function vote(uint256 _candidateId) public",
  "function getCandidate(uint256 _candidateId) public view returns (string memory, uint256)",
  "function candidateCount() public view returns (uint256)"
];

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const loadBlockchain = async () => {
      if (window.ethereum) {
      // Initialize provider and signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      
      // Request account access if needed
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Initialize contract with signer
      const contract = new Contract(contractAddress, abi, signer);

      // Set provider, signer, and contract in state
      setProvider(provider);
      setSigner(signer);
      setContract(contract);

      // Fetch the number of candidates
      const count = await contract.candidateCount();
      let tempCandidates = [];
      
      // Fetch each candidate's details and store them in state
      for (let i = 0; i < count; i++) {
        const candidate = await contract.getCandidate(i);
        tempCandidates.push({ name: candidate[0], votes: candidate[1] });
      }
      setCandidates(tempCandidates);
      } else {
      // Alert user to install MetaMask if not available
      alert("Please install MetaMask");
      }
    };
    loadBlockchain();
  }, []);

  const vote = async (id) => {
    await contract.vote(id);
    alert("Voted successfully!");
  };

  return (
    <div>
      <h1>Voting System</h1>
      {candidates.map((candidate, index) => (
        <div key={index}>
          <p>{candidate.name} - Votes: {candidate.votes.toString()}</p>
          <button onClick={() => vote(index)}>Vote</button>
        </div>
      ))}
    </div>
  );
}

export default App;
