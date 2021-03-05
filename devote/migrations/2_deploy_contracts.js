var Vote = artifacts.require("Vote");
var candidates = [ web3.utils.asciiToHex('C. Eisgruber'),
		   web3.utils.asciiToHex("Eis Eis Gruber"),
		   web3.utils.asciiToHex("Chris")
		 ];
var addresses = ['0x34BD08bFD40af3fA3d94C19Bafea2529b1a1451D',
		 '0x48eF0F667172AF5e8C99ce96f47F4d902C289695',
		 '0x1125115f1f8493297dD59DF6568593ECF70993ca',
		 '0x1125115f1f8493297dD59DF6568593ECF70993ca',
		 '0x9255DB81b5127C89f993ee1Deea50C045fe4802A',
		];

console.log("debugging: ");
console.log(candidates);
//Address to Person directory (TESTING PURPOSES ONLY, real client implementation would not have this)
//0x627 is Test 1 and the Host
//0xf17 is Test 2
//0xC5 is Test 3
//0x7ad is Michael Man
//0x41 is Sten
//0xA8C is Michael Psenka
//0xF91 is Bevin

module.exports = function(deployer) {
  deployer.deploy(Vote, candidates, addresses);
};
