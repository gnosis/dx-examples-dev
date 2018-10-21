/* global artifacts */
/* eslint no-undef: "error" */

const Safe = artifacts.require("Safe")
const DutchExchangeProxy = artifacts.require("DutchExchangeProxy")

module.exports = function(deployer, network, accounts) {  
  const account = accounts[0]
  return deployer
    // Make sure DutchX is deployed
    .then(() => DutchExchangeProxy.deployed())

    // Deploy Safe contract
    .then(dxProxy => {
      console.log('Deploying Safe with %s as the owner and %s as the DutchExchange contract', account, dxProxy.address)
      return deployer.deploy(Safe, dxProxy.address)
    })
}
