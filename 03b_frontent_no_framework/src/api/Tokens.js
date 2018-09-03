const promisedTokens = init()
export default promisedTokens

async function init() {
  const {default: promisedDeployedContracts} = await import('./Contracts')

  const { dx, ...contractMap } = await promisedDeployedContracts
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
  const getAllowance = (name, owner, spender) => getToken(name).allowance.call(owner, spender)

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
  const getBalanceOf = (name, account) => getToken(name).balanceOf.call(account)

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
    getAllowance,
    approve,
    getBalanceOf,
    getTotalSupply,
    tokens: contractMap,
    transfer,
    transferFrom,
  }
}
