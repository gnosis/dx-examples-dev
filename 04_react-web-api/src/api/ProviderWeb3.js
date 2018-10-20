import Web3 from 'web3'
import { windowLoaded } from './utils'

/** 
 * Web3 Provider API
 * Version: 1.0.0beta.xx
 * Will NOT work with Web3@0.20.xx
*/

export let appWeb3

export const getWeb3API = async () => {
  if (appWeb3) return appWeb3

  appWeb3 = await init()
  return appWeb3
}

// Grabs runtime provider - for now this is runtime only.
// if you wish to pass in your own provider on API setup,
// please add a parameter + necessary checks into getProvider
// and pass provider object during API init in src/api/index.js
const getProvider = () => {
  if (typeof window !== 'undefined' && window.web3) {
    return window.web3.currentProvider
  }

  return new Web3.providers.HttpProvider('http://localhost:8545')
}

const setupWeb3 = async () => {
  await windowLoaded

  return new Web3(getProvider())
}

async function init() {
  const web3 = await setupWeb3()

  const getAccounts = () => web3.eth.getAccounts()
  const getBalance = account => web3.eth.getBalance(account)

  /**
   * getCurrentAccount
   * @returns {string} currentAccount in Metamask || Provider web3.eth.accounts[0]
  */
  const getCurrentAccount = async () => {
    const [account] = await getAccounts()

    return account
  }

  /**
   * getCurrentBalance
   * @returns {string} ETH balance in GWEI
  */
  const getCurrentBalance = async () => {
    const [account] = await getAccounts()

    return getBalance(account)
  }

  const getNetwork = async () => {
    const network = await web3.eth.net.getId()

    switch (network) {
      case 1:
        return 'Ethereum Mainnet'

      case 2:
        return 'Morden'

      case 3:
        return 'Ropsten'

      case 4:
        return 'Rinkeby'

      case 42:
        return 'Kovan'

      case null:
      case undefined:
        return 'No network detected'

      default:
        return 'Local Network'
    }
  }

  const { utils } = web3

  /**
   * toWei // fromWei
   * @type {BigNumber}
   * @param {BigNumber} amount
   * @param {string} x = format['ether', ... ]
   * @returns {string}
   */
  const toWei = (amount, x) => utils.toWei(amount, x)
  const fromWei = (amount, x) => utils.fromWei(amount, x)
  const toBN = amount => utils.toBN(amount)

  const getBlockInfo = blockNumber => web3.eth.getBlock(blockNumber)

  // set injected web3 to ours
  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') window.web3 = web3

  return {
    web3,
    get currentProvider() {
      return web3.currentProvider
    },
    getBlockInfo,
    getCurrentAccount,
    getCurrentBalance,
    getNetwork,
    utils,
    toBN,
    fromWei,
    toWei,
  }
}
