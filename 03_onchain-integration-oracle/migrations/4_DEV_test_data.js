/* global artifacts */
/* eslint no-undef: "error" */

const ETH_TEST_AMOUNT = 1e18

const Safe = artifacts.require("Safe")

module.exports = function(deployer, network, accounts) {  
  const account = accounts[0]

  if (network === 'development') {    
    const EtherToken = artifacts.require("EtherToken")
  
    return deployer
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
}