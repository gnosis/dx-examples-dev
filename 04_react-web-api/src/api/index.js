// API
import { getTokensAPI } from './Tokens'
import { getWeb3API } from './ProviderWeb3'
import { getDutchXAPI } from './DutchX'

// API singleton
let appAPI

// API initialiser
export const getAPI = async () => {
  if (appAPI) return appAPI

  appAPI = await init()
  return appAPI
}

// ============
// WEB3
// ============

export const toBN = async (amount) => {
  const { Web3 } = await getAPI()

  return Web3.toBN(amount)
}

export const toWei = async (amount, x) => {
  const { Web3 } = await getAPI()
  // TODO: fix this - needed as web3 1.0's toBN is different from old BigNumber
  if (typeof amount === 'object') amount = await toBN(amount)

  return Web3.toWei(amount.toString(), x)
}
// TODO: toWei & fromWei not working
export const fromWei = async (amount, x) => {
  const { Web3 } = await getAPI()
  // TODO: fix this - needed as web3 1.0's toBN is different from old BigNumber
  if (typeof amount === 'object') amount = await toBN(amount)

  return Web3.fromWei(amount.toString(), x)
}

export const getCurrentAccount = async () => {
  const { Web3 } = await getAPI()

  return Web3.getCurrentAccount()
}

export const getCurrentNetwork = async () => {
  const { Web3 } = await getAPI()

  return Web3.getNetwork()
}

// TODO: possibly remove - testing only
export const getBlockTime = async (blockNumber = 'latest') => {
  const { Web3 } = await getAPI()

  const blockInfo = await Web3.getBlockInfo(blockNumber)
  return blockInfo.timestamp
}

export const getAccountAndTimestamp = async () => {
  const [account, timestamp] = await Promise.all([
    getCurrentAccount(),
    getBlockTime(),
  ])

  return {
    account,
    timestamp,
  }
}

// ============
// MISC
// ============

/**
 * checkIfAccount
 * @param {string} account
 * @returns {string} accountAddress as string
 */
export const checkIfAccount = account => account || getCurrentAccount()


/**
 * checkIfFalseAllowance
 * @param {BigNumber} amount
 * @param {*} account
 * @param {*} address
 * @type {BigNumber | boolean}
 * @returns {BigNumber | boolean}
 */
// eslint-disable-next-line
export const checkIfFalseAllowance = async (amount, account, address) => {
  const { Tokens, Web3: { toBN: BN } } = await getAPI()
  try {
    /**
     * Checklist
        * 1. check Allowance in Token
        * 2a. Allowance > amount
            * return false
        * 2b. Allowance < amount
            * amtLeft = amount - Allowance
            * const amtToApprove = (2 ** 255) -  amtLeft
            * return amtToApprove
     */

    const amountApprovedRemaining = await Tokens.allowance('gno', account, address)

    console.info('Amount Approved Remaining = ', amountApprovedRemaining)

    // IF there is NOT ENOUGH Allowance, RETURN amount needed to Approve
    if (amountApprovedRemaining.lt(amount)) {
      // BigNumber convert here
      // toApprove = (2^255) - amountAlreadyAllowed
      const toApprove = (BN(2).pow(BN(255))).sub(BN(amountApprovedRemaining))

      console.info('Approved amount = ', toApprove)

      return toApprove
    }
    return false
  } catch (e) {
    console.error(e)
  }
}

// ================
// TOKENS GNO + OWL
// ================

export const allowance = async (tokenName, account, spender) => {
  const { Tokens } = await getAPI()
  account = await checkIfAccount(account)

  return Tokens.allowance(tokenName, account, spender)
}

export const approve = async (tokenName, spender, amount, account) => {
  const { Tokens } = await getAPI()
  account = await checkIfAccount(account)

  return Tokens.approve(tokenName, spender, amount, { from: account })
}

export const getTokenBalance = async (tokenName, formatFromWei, account) => {
  const { Tokens } = await getAPI()
  account = await checkIfAccount(account)

  const bal = await Tokens.getTokenBalance(tokenName, account)

  return formatFromWei ? fromWei(bal) : bal
}

export const transfer = async (tokenName, amount, to, account) => {
  const { Tokens } = await getAPI()
  account = await checkIfAccount(account)

  return Tokens.transfer(tokenName, to, amount, { from: account })
}

export const getState = async ({ account, timestamp: time } = {}) => {
  const statePromises = Promise.all([
    time || getBlockTime(),
    getCurrentNetwork(),
  ])

  account = await checkIfAccount(account)

  const [timestamp, network] = await statePromises

  const refreshedState = {
    account,
    timestamp,
    network,
  }

  console.info('Refreshed STATE = ', refreshedState)

  return refreshedState
}

async function init() {
  const [Web3, Tokens, DutchX] = await Promise.all([
    getWeb3API(),
    getTokensAPI(),
    getDutchXAPI(),
  ])

  console.log('​API init -> ', { Web3, Tokens, DutchX })
  return { Web3, Tokens, DutchX }
}
