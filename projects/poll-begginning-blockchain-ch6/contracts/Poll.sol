pragma solidity ^0.5.16;
contract Poll {
    event Voted(address _voter, uint _value);
    mapping(address => uint) public votes;
    string pollSubject = "コーヒーは非課税にするべきだと思いますか?  賛成なら1を、 反対なら2をvote関数に渡します。";
    
    function getPoll() view public returns (string memory) {
    	return pollSubject;
    }
    
    function vote(uint selection) public {
        emit Voted(msg.sender, selection);
        require (votes[msg.sender] == 0);
        require (selection > 0 && selection < 3);
        votes[msg.sender] = selection;
    }
    function checkPoll() view public returns (uint) {
        return votes[msg.sender];
    }
} 
