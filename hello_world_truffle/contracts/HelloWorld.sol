pragma solidity ^0.5.0;

contract HelloWorld {
  string defaultMessage;

  constructor() public {
    defaultMessage = 'Hello World';
  }

  function getMessage() public view returns(string memory){
    return defaultMessage;
  }

  function getConcatenatedMessage(string memory _input) public view returns(string memory){
    /*
    return string(abi.encodePacked(defaultMessage, _input));
    */
    string memory result = new string(bytes(defaultMessage).length + bytes(_input).length);
    bytes memory resultBytes = bytes(result);
    uint dst = 0;
    for(uint i = 0; i < bytes(defaultMessage).length; i++)
      resultBytes[dst++] = bytes(defaultMessage)[i];
    for(uint i = 0; i < bytes(_input).length; i++)
      resultBytes[dst++] = bytes(_input)[i];
    return result;
  }

  function add(string memory _pred, string memory _succ) public pure returns (string memory) {
    bytes memory pred = bytes(_pred);
    bytes memory succ = bytes(_succ);
    uint reslen = pred.length;
    if (reslen < succ.length) {
      reslen = succ.length;
    }
    reslen += 1;
    bytes memory res = new bytes(reslen);
    uint8 carry = 0;
    uint i = 0;
    for(i = 0; i < reslen - 1; i++) {
      if (pred.length < i) {
        res[reslen - i - 1] = byte(uint8(succ[succ.length - i - 1]) + carry);
        carry = 0;
      } else if (succ.length < i) {
        res[reslen - i - 1] = byte(uint8(pred[pred.length - i - 1]) + carry);
        carry = 0;
      } else {
        carry = uint8(succ[succ.length - i - 1]) + uint8(pred[pred.length - i - 1]) + carry - 96;
        if (carry >= 10) {
          res[reslen - i - 1] = byte((carry % 10) + 48);
          carry = 1;
        } else {
          res[reslen - i - 1] = byte(carry + 48);
          carry = 0;
        }
      }
    }
    res[reslen - i - 1] = byte(carry + 48);
    
    return string(res);
  }
}