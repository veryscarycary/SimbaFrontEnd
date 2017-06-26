var Escrow = artifacts.require("./Escrow.sol");
module.exports = function(deployer) {
  deployer.deploy(Escrow, "0x08b41D8A406F941126fc1D15eCe163fbFA113d54", "0x0Aa7fa099de11980486A11Bcf2865f48f6a90128");
};
