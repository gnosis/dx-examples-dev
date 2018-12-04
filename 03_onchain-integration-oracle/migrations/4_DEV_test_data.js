/* global artifacts, web3 */
/* eslint no-undef: "error" */

const ETH_TEST_AMOUNT = 1 // 1 ETH

const Safe = artifacts.require("Safe")

module.exports = async (network, accounts) => {  
  const account = accounts[0]
  const BN = web3.utils.BN

  if (network === 'development') {    
    const EtherToken = artifacts.require("EtherToken")
    
    const weth = await EtherToken.deployed()

    // Wrap 1 ETH for testing
    const amount = web3.utils.toWei(
      new BN(ethUsdPrice)
    )
    console.log('Wrap %d ETH into WETH for account %s', ETH_TEST_AMOUNT, account)
    await weth.deposit({ value: amount })

    // Get safe instance
    const safe = await Safe.deployed()

    // Let the Safe take the 1 ETH (so we can deposit on it)
    console.log('Approve %d WETH for safe address %s', ETH_TEST_AMOUNT, Safe.address)
    await weth.approve(safe.address, amount)

    // Deposit the WETH into the safe
    console.log('Deposit %d WETH (%s) into the safe %s',
      ETH_TEST_AMOUNT,
      EtherToken.address,
      Safe.address
    )
    return safe.deposit(EtherToken.address, amount)
  }
}