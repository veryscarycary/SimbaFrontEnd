// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      network_id: '*', // Match any network id,
      gas: 4700000, // new! Default gas limit is 3141592
      gasPrice: 100000000000, // new! Default gas price is 100 Shannon
      from: '0x3d208fabaf7e919985d5d2f068f28d6a9022e8d5',
    }
  }
}
