/* global artifacts */
/* eslint no-undef: "error" */

const ETH_TEST_AMOUNT = 1e18

const Safe = artifacts.require("Safe")
const DutchExchangeProxy = artifacts.require("DutchExchangeProxy")

module.exports = function(deployer, network, accounts) {  
  const account = accounts[0]
  let deployerPromise = deployer
    // Make sure DutchX is deployed
    .then(() => DutchExchangeProxy.deployed())
    // Deploy Safe contract
    .then(dxProxy => {
      console.log('Deploying Safe with %s as the owner and %s as the DutchExchange contract', account, dxProxy.address)
      return deployer.deploy(Safe, dxProxy.address)
    })

  if (network === 'development') {    
    const EtherToken = artifacts.require("EtherToken")
  
    deployerPromise = deployerPromise
      .then(() => EtherToken.deployed())
      // Wrap 1 ETH for testing
      .then(weth => {
        console.log('Wrap %d ETH into WETH for account %s', ETH_TEST_AMOUNT / 1e18, account)
        return weth.deposit({ value: ETH_TEST_AMOUNT })
      })

      // Let the Safe take the 1 ETH (so we can deposit on it)
      .then(() => Safe.deployed())
      .then(() => EtherToken.deployed())      
      .then(weth => {
        console.log('Approve %d WETH for safe address %s', ETH_TEST_AMOUNT / 1e18, Safe.address)
        return weth.approve(Safe.address, ETH_TEST_AMOUNT)
      })

      // Deposit the WETH into the safe
      .then(() => Safe.deployed())
      .then(safe => {
        console.log('Deposit %d WETH (%s) into the safe %s',
          ETH_TEST_AMOUNT / 1e18,
          EtherToken.address,
          Safe.address
        )
        return safe.deposit(EtherToken.address, ETH_TEST_AMOUNT)
      })
  }

  return deployerPromise
}