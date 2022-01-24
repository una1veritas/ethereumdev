// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22;

contract BTree {
  string public storedData;
  address private owner;
  constructor() public {
    owner = msg.sender;
  }
  function set(string memory x) public {
      require(msg.sender == owner);
      storedData = x;
  }

  function get() public view returns (string memory x) {
      return storedData;
  }
}