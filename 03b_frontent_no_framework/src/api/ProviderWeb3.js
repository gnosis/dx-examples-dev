import { windowLoaded, promisify } from './utils'
// import Web3 from 'web3'

const getProvider = () => {
  if (typeof window !== 'undefined' && window.web3) {
    return window.web3.currentProvider
  }

  return new Web3.providers.HttpProvider('http://localhost:8545')
}

const setupWeb3 = async () => {
  await windowLoaded

  const Web3 = await import('web3')

  return new Web3(getProvider())
}

const promisedWeb3 = init()
export default promisedWeb3

async function init() {
  try {
    if ((typeof navigator !== 'undefined' && !navigator.onLine) || typeof window.web3  === 'undefined') throw 'Web3 connectivity issues due to client network connectivity loss'

    const web3 = await setupWeb3()

    const getAccounts = promisify(web3.eth.getAccounts, web3.eth)
    const getBalance = promisify(web3.eth.getBalance, web3.eth)

    const getBlock = promisify(web3.eth.getBlock, web3.eth)
    const getTransaction = promisify(web3.eth.getTransaction, web3.eth)
    const getTransactionReceipt = promisify(web3.eth.getTransactionReceipt, web3.eth)

    const getCurrentAccount = async () => {
      const [account] = await getAccounts()

      return account
    }

    const getETHBalance = async (account, inETH) => {
      const wei = await getBalance(account)

      return inETH ? web3.fromWei(wei, 'ether') : wei
    }

    const getNetwork = promisify(web3.version.getNetwork, web3.version)

    const isConnected = web3.isConnected.bind(web3)

    const setProvider = web3.setProvider.bind(web3)

    const isAddress = web3.isAddress.bind(web3)

    const resetProvider = () => setProvider(getProvider())

    const getTimestamp = async (block = 'latest') => {
      const blockData = await promisify(web3.eth.getBlock, web3.eth)(block)

      return blockData.timestamp
    }

    return {
      getCurrentAccount,
      getAccounts,
      getBlock,
      getTransaction,
      getTransactionReceipt,
      getETHBalance,
      getNetwork,
      isConnected,
      isAddress,
      get currentProvider() {
        return web3.currentProvider
      },
      web3,
      setProvider,
      resetProvider,
      getTimestamp,
    }
  } catch (err) {
    console.error(err)
  }
}