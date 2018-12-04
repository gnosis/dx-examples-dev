/* global artifacts */
/* eslint no-undef: "error" */

const migrateDx = require('@gnosis.pm/dx-contracts/src/migrations-truffle-5')

module.exports = function (deployer, network, accounts) {
  return migrateDx({
    artifacts,
    deployer,
    network,
    accounts,
    web3
  })
}