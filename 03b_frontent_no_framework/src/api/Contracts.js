/**
 * Contract deployment
 */
import TruffleContract from 'truffle-contract'
// import promisedWeb3 from './ProviderWeb3'

// Deployed app contracts singleton API
export let appContracts

// contract array, strings
// ADD HERE contracts you want to deploy - names should be exactly as read in build/contracts (without .json)
const contracts = [
  'DutchExchange',
  'DutchExchangeProxy',
  'EtherToken',
  'TokenFRT',
  'TokenOWL',
  'TokenOWLProxy'
]

// to make access easier later...
export const shortContractNames = {
  DutchExchange: 'dx',
  DutchExchangeProxy: 'dxProxy',
  EtherToken: 'eth',
  TokenFRT: 'frt',
  TokenOWL: 'owl',
  TokenOWLProxy: 'owlProxy'
}

export const longContractNames = Object.entries(shortContractNames).reduce((accum, [key, val]) => (accum[val] = key, accum), {})

let contractArtifacts
// when not on local ganache, import what is available from @gnosis.pm/owl-token
// and later separately TokenGNO from @gnosis.pm/gno-token
if (process.env.NODE_ENV === 'development') {
  contractArtifacts = [
    require('../../build/contracts/DutchExchange.json'),
    require('../../build/contracts/DutchExchangeProxy.json'),
    require('../../build/contracts/EtherToken.json'),
    require('../../build/contracts/TokenFRT.json'),
    require('../../build/contracts/TokenOWL.json'),
    require('../../build/contracts/TokenOWLProxy.json'),
  ]
} else {

  contractArtifacts = [
    require('@gnosis.pm/dx-contracts/build/contracts/DutchExchange.json'),
    require('@gnosis.pm/dx-contracts/build/contracts/DutchExchangeProxy.json'),
    require('@gnosis.pm/util-contracts/build/contracts/EtherToken.json'),
    require('@gnosis.pm/dx-contracts/build/contracts/TokenFRT.json'),
    require('@gnosis.pm/owl-token/build/contracts/TokenOWL.json'),
    require('@gnosis.pm/owl-token/build/contracts/TokenOWLProxy.json'),
  ]
}

const networksUtils = require('@gnosis.pm/util-contracts/networks.json'),
  networksGNO   = require('@gnosis.pm/gno-token/networks.json'),
  networksOWL   = require('@gnosis.pm/owl-token/networks.json'),
  networksDX   = require('@gnosis.pm/dx-contracts/networks.json')

for (const contrArt of contractArtifacts) {
  const { contractName } = contrArt
  // assign networks from the file, overriding from /build/contracts with same network id
  // but keeping local network ids
  Object.assign(
    contrArt.networks,
    networksUtils[contractName],
    networksGNO[contractName],
    networksOWL[contractName],
    networksDX[contractName],
  )
}

// in development use different contract addresses
if (process.env.NODE_ENV === 'development') {
  // from networks-%ENV%.json
  const networksDX    = require('@gnosis.pm/dx-contracts/networks-dev.json')

  for (const contrArt of contractArtifacts) {
    const { contractName } = contrArt
    // assign networks from the file, overriding from /build/contracts with same network id
    // but keeping local network ids
    Object.assign(contrArt.networks, networksDX[contractName])
  }
}

// Wrap and deploy HumanFriendlyToken to interface with any Token contract addresses called
export const HumanFriendlyToken = TruffleContract(require('@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'))


/**
 * TruffleWrappedContractArtifacts = TruffleContract(contract artifacts/json)
 * @returns {[string]} ContractsABI[] -> UNDEPLOYED
 * 
 * Key
 * 0: DutchExchange
 * 1: DX-Proxy
 * 2: EtherToken
 * 3: TokenFRT
 * 4: TokenOWL
 * 5: TokenOWLProxy
*/
const TruffleWrappedContractArtifacts = contractArtifacts.map(contractArtifact => TruffleContract(contractArtifact))

/**
 * setContractProvider
 * Sets provider for each contract - provider is created in api/ProviderWeb3
 * @param string provider
 */
const setContractProvider = provider => TruffleWrappedContractArtifacts.forEach((c) => { c.setProvider(provider) })

/**
 * getPromisedInstances: () => Promise<ContractCode[]>
 * Deploys each contract in TruffleWrappedContracts array
 * @returns Promise<Deployed_Contracts[]>
 */
const getPromisedInstances = () => Promise.all(TruffleWrappedContractArtifacts.map(c => c.deployed()))


const promisedDeployedContracts = init()
export default promisedDeployedContracts

async function init() {
  const { default: promisedWeb3 } = await import('./ProviderWeb3')
  const { currentProvider } = await promisedWeb3
  
  // set Provider for each TC wrapped ContractABI
  setContractProvider(currentProvider)

  /* AT THIS POINT: all contracts have their provider */

  // get back all deployed, provider ready
  // instances of contracts
  /**
   * @returns {Array} [ deployedContract1, deployedContract2, ... ]
   */
  let deployedContracts
  try {
    deployedContracts = await getPromisedInstances()
  } catch (error) {
    // in browser display an error
    // in prebuild react render don't do anything
    if (typeof window !== 'undefined') console.error(error)
    return {}
  }
  
  // Attach deployedContract instance as VALUE of
  // short name contract
  // e.g { 'eth': deployedContractCode }
  const dxContractsAPI = deployedContracts.reduce((acc, contract, index) => {
    acc[shortContractNames[contracts[index]]] = contract
    return acc
  }, {})
  
  const { address: proxyAddress } = dxContractsAPI.dxProxy
  const { address: owlProxyAddress } = dxContractsAPI.owlProxy

  // DutchExchange.at(proxyAddress)
  dxContractsAPI.dx = TruffleWrappedContractArtifacts[0].at(proxyAddress)
  // TokenOWL.at(owlProxyAddress)
  dxContractsAPI.owl = TruffleWrappedContractArtifacts[4].at(owlProxyAddress)
  
  delete dxContractsAPI.dxProxy
  delete dxContractsAPI.owlProxy
    
  if (process.env.NODE_ENV === 'development') {
    // make it available globally
    window._react_dapp_contracts = dxContractsAPI
  }
  
  console.log('​dxContractsAPI', dxContractsAPI);
  return dxContractsAPI
}
