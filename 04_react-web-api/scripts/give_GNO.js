/* eslint no-console:0 */

const TruffleContract = require('truffle-contract')
const TokenGNO = TruffleContract(require('@gnosis.pm/gno-token/build/contracts/TokenGNO'))
const TokenOWL = TruffleContract(require('@gnosis.pm/owl-token/build/contracts/TokenOWL'))
const TokenOWLProxy = TruffleContract(require('@gnosis.pm/owl-token/build/contracts/TokenOWLProxy'))

const Web3 = require('web3')


require('dotenv').config()

let { network = process.env.ETH_NETWORK, a, n } = require('minimist')(process.argv.slice(2), { string: 'a' })


const mnemonic = process.env.MNEMONIC
// const privKey = process.env.KEY

let getProvider

// if private key supplied use it
/* if (privKey) {
  const HDWalletProvider = require('truffle-hdwallet-provider-privkey')
  getProvider = url => new HDWalletProvider(privKey, url)
  // else use mnemonic if supplied
} else  */
if (mnemonic) {
  const HDWalletProvider = require('truffle-hdwallet-provider')
  getProvider = url => new HDWalletProvider(mnemonic, url)
  // if network isn't specified, defaulting to development
} else if (network === undefined || network === 'development') {
  getProvider = url => new Web3.providers.HttpProvider(url)
  // else abort as we need MNEMONIC or a private KEY
} else {
  throw new Error('No KEY or MNEMONIC supplied, aborting')
}


const getNetworkURL = (net) => {
  switch (net) {
    case 'rinkeby':
      return 'https://rinkeby.infura.io/'
    case 'kovan':
      return 'https://kovan.infura.io/'
    case 'main':
    case 'live':
      return 'https://main.infura.io/'
    case 'development':
    default:
      return 'http://localhost:8545'
  }
}

run()


/**
 * truffle exec trufflescripts/give_GNO.js
 * give tokens from master
 * @flags:
 * -a <address>       to the given address
 * --n <number>       GNO tokens
 */

async function run() {
  const provider = getProvider(getNetworkURL(network))

  const web3 = new Web3(provider)
  const accounts = await new Promise((res, rej) => {
    web3.eth.getAccounts((e, accs) => {
      if (e) return rej(e)

      res(accs)
    })
  })

  const account = accounts[0].toLowerCase()

  TokenGNO.setProvider(provider)
  TokenOWL.setProvider(provider)
  TokenOWLProxy.setProvider(provider)

  const GNOcontr = await TokenGNO.deployed()
  console.log('GNOcontr address:', GNOcontr.address)
  const OWLProxycontr = await TokenOWLProxy.deployed()
  const OWLcontr = await TokenOWL.at(OWLProxycontr.address)

  console.log('OWL creator', await OWLcontr.creator.call())

  const decimals = (await GNOcontr.decimals.call()).toNumber()
  console.log('decimals: ', decimals)

  console.log('GNO total', (await GNOcontr.totalSupply.call()).toString())


  const printBal = async (acc) => {
    const bal = (await GNOcontr.balanceOf.call(acc)).div(10 ** decimals).toString()

    console.log('balance of', acc, bal)
  }

  await printBal(account)

  if (n > 0) {
    const amount = n * (10 ** decimals)

    console.log(`From account ${account}`)

    a = a.split(',')

    await Promise.all(a.map(async (acc) => {
      await GNOcontr.transfer(acc, amount, { from: account })
      console.log(`transferred ${n} GNO to ${acc}`)
    }))
  }

  await printBal(account)

  process.exit(0)
}

