pragma solidity ^0.5.0;

contract HelloWorld {
  string message;
  bytes result;

  constructor() public {
    message = "Hello, world!";
  }

  function getMessage() public view returns(string memory){
    return message;
  }

  function getConcatenated(string memory _input) public view returns(string memory){
    return string(abi.encodePacked(message, _input));
  }

  function fbcd_add(uint128 _x, uint128 _y) public pure returns (uint128) {
    uint128 r = 0;
    uint16 _x_stat = uint16(_x >> 112);
    uint16 _y_stat = uint16(_y >> 112);
    if (_x_stat == 0 && _y_stat == 0) {
      return _x + _y;
    }
    _x = _x & ~(uint128(0xffff) << 112);
    _y = _y & ~(uint128(0xffff) << 112);
    return _x + _y;
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