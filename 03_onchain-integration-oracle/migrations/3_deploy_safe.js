/* global artifacts */
/* eslint no-undef: "error" */

const Safe = artifacts.require("Safe")
const DutchExchangeProxy = artifacts.require("DutchExchangeProxy")

module.exports = async (deployer, network, accounts) => {  
  const account = accounts[0]

  // Make sure the proxy is deployed
  const dxProxy = await DutchExchangeProxy.deployed()
  
  // Deploy the Safe
  console.log('Deploying Safe with %s as the owner and %s as the DutchExchange contract', account, dxProxy.address)
  await deployer.deploy(Safe, dxProxy.address)
}
