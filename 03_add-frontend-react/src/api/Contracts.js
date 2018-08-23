/**
 * Contract deployment
 */
import TruffleContract from 'truffle-contract'
import { getWeb3API } from './ProviderWeb3'

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
const shortContractNames = {
  DutchExchange: 'dx',
  DutchExchangeProxy: 'dxProxy',
  EtherToken: 'eth',
  TokenFRT: 'frt',
  TokenOWL: 'owl',
  TokenOWLProxy: 'owlProxy'
}

let req
// when not on local ganache, import what is available from @gnosis.pm/owl-token
// and later separately TokenGNO from @gnosis.pm/gno-token
if (process.env.NODE_ENV === 'development') {
  req = require.context(
    '../../build/contracts/',
    false,
    /(DutchExchange|DutchExchangeProxy|EtherToken|TokenFRT|TokenOWL|TokenOWLProxy)\.json$/,
  )
} else {
  req = require.context(
    '@gnosis.pm/dx-contracts/build/contracts/',
    false,
    /(DutchExchange|DutchExchangeProxy|TokenFRT|EtherToken|TokenGNO|TokenOWL|TokenOWLProxy)\.json$/,
  )
}

// Wrap and deploy HumanFriendlyToken to interface with any Token contract addresses called
export const HumanFriendlyToken = TruffleContract(require('@gnosis.pm/util-contracts/build/contracts/HumanFriendlyToken.json'))

const reqKeys = req.keys()
/**
 * contractArtifacts
 * Array of imported contract artifacts (jsons) from build/contracts
 * @type ["./OWLAirdrop.json", "./TokenGNO.json", "./TokenOWL.json", "./TokenOWLProxy.json"]
 */
const contractArtifacts = contracts.map(c => {
  if (process.env.NODE_ENV === 'production') {
    if (c === 'EtherToken')     return require('@gnosis.pm/util-contracts/build/contracts/EtherToken.json')
    if (c === 'TokenGNO')       return require('@gnosis.pm/gno-token/build/contracts/TokenGNO.json')
    if (c === 'TokenOWLProxy')  return require('@gnosis.pm/owl-token/build/contracts/TokenOWLProxy.json')
    if (c === 'TokenOWL')       return require('@gnosis.pm/owl-token/build/contracts/TokenOWL.json')
  }
  return req(reqKeys.find(key => key === `./${c}.json`))
})

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

/**
 * initAppContracts = async () => {
 * getContracts
 * @type Promise<{ dx: object, gno: object, proxy: object }> Object with deployed contracts mapped to their short names
   {
    dx: deployedDXContractCode,
    eth: deployedContractCode,
    gno: deployedContractCode,
    ...
   }
 */
export const getAppContracts = async () => {
  if (appContracts) return appContracts

  appContracts = await init()
  return appContracts
}

async function init() {
  const { currentProvider } = await getWeb3API()
  
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
  
  dxContractsAPI.dx = TruffleWrappedContractArtifacts[0].at(proxyAddress)
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
