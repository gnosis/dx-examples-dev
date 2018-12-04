/* global artifacts */
/* eslint no-undef: "error" */

// migrateDx
//  * Is a migration script made for deploying DutchX in a local-ganache test
//    environment in a simpler way
//  * For more details check out:
//    https://github.com/gnosis/dx-contracts/blob/master/src/migrations-truffle-4/index.js
const migrateDx = require('@gnosis.pm/dx-contracts/src/migrations-truffle-4')

module.exports = function (deployer, network, accounts) {
  return migrateDx({
    artifacts,
    deployer,
    network,
    accounts,
    web3,
    thresholdNewTokenPairUsd: process.env.THRESHOLD_NEW_TOKEN_PAIR_USD,
    thresholdAuctionStartUsd: process.env.THRESHOLD_AUCTION_START_USD
  })
}