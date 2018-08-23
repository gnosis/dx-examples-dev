
/**
 * Tokens OWL and Tokens GNO API
 */

import { getAppContracts } from './Contracts'

// tokensAPI singleton
export let tokensAPI

export const getTokensAPI = async () => { 
  if (tokensAPI) return tokensAPI
  
  tokensAPI = await init()
  return tokensAPI
}

async function init() {
  const contractMap = await getAppContracts()
  /**
   * getToken
   * @param {string} name tokenName ['gno', 'owl']
   * @returns {contract} TokenContract => TokenGNO.deployed() || tokenOWL.deployed()
   */
  const getToken = (name) => {
    const token = contractMap[name]

    if (!token) throw new Error(`No such Token ${name}`)

    return token
  }
  // return tokenAPI methods here...
  /**
   * allowance
   * @param {string} name TOKEN name as string
   * @param {string} owner OWNER address
   * @param {string} spender SPENDER address
   * @returns {Promise<BigNumber>} allowance
   */
  const allowance = (name, owner, spender) => getToken(name).allowance.call(owner, spender)

  /**
   * approve
   * @param {string} name
   * @param {string} spender
   * @param {number} value
   * @param {{ from: string }} tx
   * @returns {object} txReceipt
   */
  const approve = (name, spender, value, tx) => getToken(name).approve(spender, value, tx)

  /**
   * getTokenBalance
   * @param {string} name
   * @param {string} account
   * @returns {Promise<BigNumber>} balance
   */
  const getTokenBalance = (name, account) => getToken(name).balanceOf.call(account)

  /**
   * getTotalSupply
   * @param {string} name TOKEN name as string
   * @returns {Promise<BigNumber>} total supply
   */
  const getTotalSupply = name => getToken(name).totalSupply.call()

  /**
   * transfer
   * @param {string} name name of token as string
   * @param {string} to address to send to as string
   * @param {number} value value to send as number
   * @param {{ from: string }} tx transaction object
   * @returns {object} txReceipt
   */
  const transfer = (name, to, value, tx) => getToken(name).transfer(to, value, tx)

  /**
   * transferFrom
   * @param {string} name name of token as string
   * @param {string} from address to send FROM as string
   * @param {string} to address to send TO as string
   * @param {number} value value to send as number
   * @param {{ from: string }} tx transaction object
   * @returns {object} txReceipt
   */
  const transferFrom = (name, from, to, value, tx) => getToken(name).transferFrom(from, to, value, tx)

  return {
    allowance,
    approve,
    getTokenBalance,
    getTotalSupply,
    tokens: contractMap,
    transfer,
    transferFrom,
  }
}
