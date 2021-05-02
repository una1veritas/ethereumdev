const HelloContract = artifacts.require('Hello.sol');

module.exports = function(_deployer) {
  _deployer.deploy(HelloContract, 'Hello');
};
