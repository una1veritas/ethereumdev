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

  function add(string memory _p, string memory _s) public pure returns (string memory) {
    bytes memory p = bytes(_p);
    bytes memory s = bytes(_s);
    uint rlen = p.length;
    if (rlen < s.length) {
      rlen = s.length;
    }
    bytes memory r = new bytes(rlen);
    uint8 carry = 0;
    uint i;
    for(i = 0; i < rlen; i++) {
      uint8 d = carry;
      if (p.length > i) {
        d += uint8(p[p.length - i - 1]) - 48;
      }
      if (s.length > i) {
        d += uint8(s[s.length - i - 1]) - 48;
      }
      if (d >= 10) {
        carry = 1;
        d -= 10;
      } else {
        carry = 0;
      }
      r[rlen - i - 1] = byte(d + 48);
    }
    if (carry != 0) {
      bytes memory cr = new bytes(rlen+1);
      cr[0] = byte("1");
      for(i = 0; i < rlen; i++) {
        cr[i+1] = r[i];
      }
      return string(cr);
    } 
    return string(r);
  }
}