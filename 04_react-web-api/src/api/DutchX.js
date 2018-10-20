import { getAppContracts } from './Contracts'

let dutchXAPI

export const getDutchXAPI = async () => {
  if (dutchXAPI) return dutchXAPI

  dutchXAPI = await init()
  return dutchXAPI
}

async function init() {
  const { dx } = await getAppContracts()

  const getFRTAddress = () => dx.frtToken.call()
  const getOWLAddress = () => dx.owlToken.call()
  const getPriceFeedAddress = () => dx.ethUSDOracle.call()

  const getLatestAuctionIndex = ({ sell: { address: t1 }, buy: { address: t2 } }) =>
    dx.getAuctionIndex.call(t1, t2)

  const getAuctionStart = ({ sell: { address: t1 }, buy: { address: t2 } }) =>
    dx.getAuctionStart.call(t1, t2)

  const getClosingPrice = ({ sell: { address: t1 }, buy: { address: t2 } }, index) =>
    dx.closingPrices.call(t1, t2, index)

  const getLastAuctionPrice = ({ sell: { address: t1 }, buy: { address: t2 } }, index) =>
    dx.getPriceInPastAuction.call(t1, t2, index)

  const getPrice = ({ sell: { address: t1 }, buy: { address: t2 } }, index) =>
    dx.getCurrentAuctionPrice.call(t1, t2, index)

  const getSellVolumesCurrent = ({ sell: { address: t1 }, buy: { address: t2 } }) =>
    dx.sellVolumesCurrent.call(t1, t2)

  const getSellVolumesNext = ({ sell: { address: t1 }, buy: { address: t2 } }) =>
    dx.sellVolumesNext.call(t1, t2)

  const getBuyVolumes = ({ sell: { address: t1 }, buy: { address: t2 } }) =>
    dx.buyVolumes.call(t1, t2)

  const getExtraTokens = ({ sell: { address: t1 }, buy: { address: t2 } }) =>
    dx.extraTokens.call(t1, t2)

  const getSellerBalances = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.sellerBalances.call(t1, t2, index, userAccount)

  const getBuyerBalances = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.buyerBalances.call(t1, t2, index, userAccount)

  const getClaimedAmounts = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.claimedAmounts.call(t1, t2, index, userAccount)

  const postSellOrder = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    index,
    userAccount,
  ) => dx.postSellOrder(t1, t2, index, amount, { from: userAccount })

  postSellOrder.call = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    index,
    userAccount,
  ) => dx.postSellOrder.call(t1, t2, index, amount, { from: userAccount })

  postSellOrder.sendTransaction = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    index,
    userAccount,
  ) => dx.postSellOrder.sendTransaction(t1, t2, index, amount, { from: userAccount })

  const postBuyOrder = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    index,
    userAccount,
  ) => dx.postBuyOrder(t1, t2, index, amount, { from: userAccount })

  postBuyOrder.call = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    index,
    userAccount,
  ) => dx.postBuyOrder.call(t1, t2, index, amount, { from: userAccount })

  const claimSellerFunds = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.claimSellerFunds(t1, t2, userAccount, index, { from: userAccount })

  claimSellerFunds.call = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.claimSellerFunds.call(t1, t2, userAccount, index)

  const claimTokensFromSeveralAuctionsAsSeller = (
    sellTokenAddresses,
    buyTokenAddresses,
    indices,
    account,
  ) => dx.claimTokensFromSeveralAuctionsAsSeller(
    sellTokenAddresses,
    buyTokenAddresses,
    indices,
    account,
    { from: account },
  )

  claimTokensFromSeveralAuctionsAsSeller.sendTransaction = (
    sellTokenAddresses,
    buyTokenAddresses,
    indices,
    account,
  ) => dx.claimTokensFromSeveralAuctionsAsSeller.sendTransaction(
    sellTokenAddresses,
    buyTokenAddresses,
    indices,
    account,
    { from: account },
  )

  const claimBuyerFunds = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.claimBuyerFunds(t1, t2, userAccount, index, { from: userAccount })

  claimBuyerFunds.call = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    userAccount,
  ) => dx.claimBuyerFunds.call(t1, t2, userAccount, index)

  const deposit = (tokenAddress, amount, userAccount) =>
    dx.deposit(tokenAddress, amount, { from: userAccount })

  const withdraw = (tokenAddress, amount, userAccount) =>
    dx.withdraw(tokenAddress, amount, { from: userAccount })

  withdraw.sendTransaction = (tokenAddress, amount, userAccount) =>
    dx.withdraw.sendTransaction(tokenAddress, amount, { from: userAccount })

  const depositAndSell = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    userAccount,
  ) => dx.depositAndSell(t1, t2, amount, { from: userAccount })

  depositAndSell.call = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    userAccount,
  ) => dx.depositAndSell.call(t1, t2, amount, { from: userAccount })

  depositAndSell.sendTransaction = (
    { sell: { address: t1 }, buy: { address: t2 } },
    amount,
    userAccount,
  ) => dx.depositAndSell.sendTransaction(t1, t2, amount, { from: userAccount })

  const claimAndWithdraw = (
    { sell: { address: t1 }, buy: { address: t2 } },
    index,
    amount,
    userAccount,
  ) => dx.claimAndWithdraw(t1, t2, userAccount, index, amount, { from: userAccount })

  const isTokenApproved = tokenAddress => dx.approvedTokens.call(tokenAddress)

  const getApprovedAddressesOfList = tokenAddresses => dx.getApprovedAddressesOfList.call(tokenAddresses)

  const getDXTokenBalance = (tokenAddress, userAccount) =>
    dx.balances.call(tokenAddress, userAccount)

  const getRunningTokenPairs = tokenList => dx.getRunningTokenPairs.call(tokenList)

  const getSellerBalancesOfCurrentAuctions = (
    sellTokenArr,
    buyTokenArr,
    userAccount,
  ) => dx.getSellerBalancesOfCurrentAuctions.call(sellTokenArr, buyTokenArr, userAccount)

  const getIndicesWithClaimableTokensForSellers = (
    { sell: { address: sellToken }, buy: { address: buyToken } },
    userAccount,
    lastNAuctions = 0,
  ) => dx.getIndicesWithClaimableTokensForSellers.call(sellToken, buyToken, userAccount, lastNAuctions)

  const getFeeRatio = userAccount => dx.getFeeRatio.call(userAccount)

  const event = (
    eventName,
    valueFilter,
    filter,
    cb,
  ) => {
    const dxEvent = dx[eventName]

    if (typeof dxEvent !== 'function') throw new Error(`No event with ${eventName} name found on DutchExchange contract`)

    return dxEvent(valueFilter, filter, cb)
  }

  const allEvents = dx.allEvents.bind(dx)

  return {
    get address() {
      return dx.address
    },
    getFRTAddress,
    getOWLAddress,
    getPriceFeedAddress,
    isTokenApproved,
    getApprovedAddressesOfList,
    getDXTokenBalance,
    getLatestAuctionIndex,
    getAuctionStart,
    getClosingPrice,
    getLastAuctionPrice,
    getPrice,
    getSellVolumesCurrent,
    getSellVolumesNext,
    getBuyVolumes,
    getExtraTokens,
    getSellerBalances,
    getBuyerBalances,
    getRunningTokenPairs,
    getSellerBalancesOfCurrentAuctions,
    getIndicesWithClaimableTokensForSellers,
    getClaimedAmounts,
    claimTokensFromSeveralAuctionsAsSeller,
    getFeeRatio,
    postSellOrder,
    postBuyOrder,
    claimSellerFunds,
    claimBuyerFunds,
    deposit,
    withdraw,
    depositAndSell,
    claimAndWithdraw,
    event,
    allEvents,
  }
}
