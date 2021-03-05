pragma solidity ^0.4.22;

contract Vote{
    //maps each address to a boolean (has this key voted yet)
    //mapping (bytes32 => bool) hasVoted;
    mapping(address => int) voterLog;
    
    //array of candidate strings
    bytes32 [] public candidates;
    
    //maps each candidate name to an integer holding their votes
    mapping (bytes32 => uint) votes;
        
    //Constructor takes in an array of candidates
    constructor(bytes32[] memory args, address[] memory addresses) public {
	require(addresses.length > 0 && addresses.length <= 16);
	require(candidates.length < 8);
        for(uint i = 0; i < addresses.length; i++){
            voterLog[addresses[i]] = -1;
        }
        candidates = args;
    }
    
    /* --- PUBLIC FUNCTIONS --- */
    
    //returns the number of candidates
    function getNumCandidates() public view returns (uint256) {
        return candidates.length;
    }    
    
    //returns the name of the nth candidate
    function getCandidate(uint8 n) public view returns (bytes32){
        return candidates[n];
    }
    
    //returns the number of votes this candidate has recieved
    function getVotesForCandidate(bytes32 name) public view returns (uint){
        return votes[name];
    }
    
    //returns true if vote was successful, false otherwise
    function sendVote(bytes32 name) public returns (bool){
        if (!eligible()){
            return false;
        }
        
        votes[name] = votes[name] + 1;
        voterLog[msg.sender] = 1;
        return true;
    }
    
    //returns true if the address is eligible to cast a vote
    function eligible() public view returns (bool){
        if(voterLog[msg.sender] == -1){
            return true;
        }
        return false;
    }
    
    //returns true if the voter address is valid (regardless of if they have already voted)
    function validVoter() public view returns(bool){
        if(voterLog[msg.sender] == 0){
            return false;
        }
        return true;
    }
    
    //returns the address of the caller
    function caller() public view returns (address){
        return msg.sender;
    }   
}
