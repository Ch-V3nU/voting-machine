// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title Voting
 * @dev Implements voting process along with vote delegation
 */
contract Voting {
    struct Candidate {
        string name;
        uint voteCount;
    }

    address public immutable owner;
    mapping(uint => Candidate) public candidates;
    mapping(address => uint8) public hasVoted;
    uint public candidateCount;

    event Voted(address indexed voter, uint candidateId);
    event CandidateAdded(uint candidateId, string name);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    /**
     * @dev Constructor sets the contract deployer as the owner.
     */
    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Adds a new candidate to the election.
     * @param _name The name of the candidate.
     */
    function addCandidate(string memory _name) public onlyOwner {
        candidates[candidateCount++] = Candidate(_name, 0);
        emit CandidateAdded(candidateCount - 1, _name);
    }

    /**
     * @dev Casts a vote for a candidate.
     * @param _candidateId The ID of the candidate to vote for.
     */
    function vote(uint _candidateId) public {
        require(candidateCount > 0, "No candidates available to vote");
        require(hasVoted[msg.sender] == 0, "You have already voted");
        require(_candidateId < candidateCount, "Invalid candidate ID");

        candidates[_candidateId].voteCount++;
        hasVoted[msg.sender] = 1;

        emit Voted(msg.sender, _candidateId);
    }

    /**
     * @dev Returns the candidate details.
     * @param _candidateId The ID of the candidate.
     * @return Candidate details.
     */
    function getCandidate(uint _candidateId) public view returns (Candidate memory) {
        require(_candidateId < candidateCount, "Invalid candidate ID");
        return candidates[_candidateId];
    }
}
