import Web3 from 'web3'
import { networkById, ETHEREUM_NETWORKS } from '../../globals' 

export const getAccount = async provider => {
  const [account] = await provider.web3.eth.getAccounts()

  return account
}

export const getNetwork = async provider => {
  const networkId = await provider.web3.eth.net.getId()

  return networkById[networkId] || 'Unknown - Maybe localhost?'
}

export const getBalance = async (provider, account) => {
  const balance = await provider.web3.eth.getBalance(account)

  return provider.web3.utils.fromWei(balance, 'ether').toString()
}

const getTime = async provider => (await provider.web3.eth.getBlock('latest')).timestamp

// get Provider state
export const grabProviderState = async (provider) => {
  const [account, network, timestamp] = await Promise.all([
    getAccount(provider),
    getNetwork(provider),
    getTime(),
  ])

  const balance = account && await getBalance(provider, account)
  const available = provider.walletAvailable
  const unlocked = !!(available && account)
  const newState = { account, network, balance, available, unlocked, timestamp }

  return newState
}

const Providers = {
  // runtime providers (METAMASK/MIST/PARITY)
  INJECTED_WALLET: {
    priority: 90,
    providerType: 'INJECTED_WALLET',
    keyName: 'INJECTED_WALLET',

    get providerName() {
      if (!this.checkAvailability()) return null

      if (window.web3.currentProvider.constructor.name === 'Web3ProviderEngine') return 'GNOSIS SAFE'
      if (window.web3.currentProvider.isMetaMask) return 'METAMASK'
      if (window.mist && window.web3.currentProvider.constructor.name === 'EthereumProvider') return 'MIST'
      if (window.web3.currentProvider.constructor.name === 'StatusHttpProvider') return 'STATUS'

      return window.web3.currentProvider.constructor.name
    },

    checkAvailability() {
      if (this.web3) return this.walletAvailable = true
      return this.walletAvailable = typeof window.web3 !== 'undefined' && window.web3.currentProvider.constructor
    },

    initialize() {
      if (!this.checkAvailability()) return
      this.web3 = new Web3(window.web3.currentProvider)
      this.state = {}

      return this.web3
    },
  },
}

export default Providers
