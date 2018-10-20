const promisedDutchXAPI = init()

export default promisedDutchXAPI

async function init() {
  const {default: promisedDeployedContracts} = await import('./Contracts')

  const { dx } = await promisedDeployedContracts

  const getAuctionIndex = (sellAddr, buyAddr) =>
    dx.getAuctionIndex.call(sellAddr, buyAddr)

  const getAuctionStart = (sellAddr, buyAddr) =>
    dx.getAuctionStart.call(sellAddr, buyAddr)

  const getClosingPrices = (sellAddr, buyAddr, index) =>
    dx.closingPrices.call(sellAddr, buyAddr, index)

  const getPriceInPastAuction = (sellAddr, buyAddr, index) =>
    dx.getPriceInPastAuction.call(sellAddr, buyAddr, index)

  const getCurrentAuctionPrice = (sellAddr, buyAddr, index) =>
    dx.getCurrentAuctionPrice.call(sellAddr, buyAddr, index)

  const getSellVolumesCurrent = (sellAddr, buyAddr) =>
    dx.sellVolumesCurrent.call(sellAddr, buyAddr)

  const getSellVolumesNext = (sellAddr, buyAddr) =>
    dx.sellVolumesNext.call(sellAddr, buyAddr)

  const getBuyVolumes = (sellAddr, buyAddr) =>
    dx.buyVolumes.call(sellAddr, buyAddr)

  const getExtraTokens = (sellAddr, buyAddr) =>
    dx.extraTokens.call(sellAddr, buyAddr)

  const getSellerBalances = (
    sellAddr, buyAddr,
    index,
    userAccount,
  ) => dx.sellerBalances.call(sellAddr, buyAddr, index, userAccount)

  const getBuyerBalances = (
    sellAddr, buyAddr,
    index,
    userAccount) => dx.buyerBalances.call(sellAddr, buyAddr, index, userAccount)

  const getClaimedAmounts = (
    sellAddr, buyAddr,
    index,
    userAccount,
  ) => dx.claimedAmounts.call(sellAddr, buyAddr, index, userAccount)

  const postSellOrder = (
    sellAddr, buyAddr,
    amount,
    index,
    userAccount,
  ) => dx.postSellOrder(sellAddr, buyAddr, index, amount, { from: userAccount })

  postSellOrder.call = (
    sellAddr, buyAddr,
    amount,
    index,
    userAccount,
  ) => dx.postSellOrder.call(sellAddr, buyAddr, index, amount, { from: userAccount })

  postSellOrder.sendTransaction = (
    sellAddr, buyAddr,
    amount,
    index,
    userAccount,
  ) => dx.postSellOrder.sendTransaction(sellAddr, buyAddr, index, amount, { from: userAccount })

  const postBuyOrder = (
    sellAddr, buyAddr,
    amount,
    index,
    userAccount,
  ) => dx.postBuyOrder(sellAddr, buyAddr, index, amount, { from: userAccount })

  postBuyOrder.call = (
    sellAddr, buyAddr,
    amount,
    index,
    userAccount,
  ) => dx.postBuyOrder.call(sellAddr, buyAddr, index, amount, { from: userAccount })

  const claimSellerFunds = (
    sellAddr, buyAddr,
    userAccount,
    index,
  ) => dx.claimSellerFunds(sellAddr, buyAddr, userAccount, index, { from: userAccount })

  claimSellerFunds.call = (
    sellAddr, buyAddr,
    userAccount,
    index,
  ) => dx.claimSellerFunds.call(sellAddr, buyAddr, userAccount, index)

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
    { from },
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
    { from },
  )

  const claimBuyerFunds = (
    sellAddr, buyAddr,
    index,
    userAccount,
  ) => dx.claimBuyerFunds(sellAddr, buyAddr, userAccount, index, { from: userAccount })

  claimBuyerFunds.call = (
    sellAddr, buyAddr,
    index,
    userAccount,
  ) => dx.claimBuyerFunds.call(sellAddr, buyAddr, userAccount, index)

  const deposit = (tokenAddress, amount, userAccount) =>
    dx.deposit(tokenAddress, amount, { from: userAccount })

  const withdraw = (tokenAddress, amount, userAccount) =>
    dx.withdraw(tokenAddress, amount, { from: userAccount })

  withdraw.sendTransaction = (tokenAddress, amount, userAccount) =>
    dx.withdraw.sendTransaction(tokenAddress, amount, { from: userAccount })

  const depositAndSell = (
    sellAddr, buyAddr,
    amount,
    userAccount,
  ) => dx.depositAndSell(sellAddr, buyAddr, amount, { from: userAccount })

  depositAndSell.call = (
    sellAddr, buyAddr,
    amount,
    userAccount,
  ) => dx.depositAndSell.call(sellAddr, buyAddr, amount, { from: userAccount })

  depositAndSell.sendTransaction = (
    sellAddr, buyAddr,
    amount,
    userAccount,
  ) => dx.depositAndSell.sendTransaction(sellAddr, buyAddr, amount, { from: userAccount })

  const claimAndWithdraw = (
    sellAddr, buyAddr,
    userAccount,
    index,
    amount,
    ) => dx.claimAndWithdraw(sellAddr, buyAddr, userAccount, index, amount, { from: userAccount })

  const getApprovedTokens = (tokenAddress) => dx.approvedTokens.call(tokenAddress)

  const getApprovedAddressesOfList = (tokenAddresses) => dx.getApprovedAddressesOfList.call(tokenAddresses)

  const getBalances = (tokenAddress, userAccount) =>
    dx.balances.call(tokenAddress, userAccount)

  const getRunningTokenPairs = (tokenList) => dx.getRunningTokenPairs.call(tokenList)

  const getSellerBalancesOfCurrentAuctions = (
    sellTokenArr,
    buyTokenArr,
    userAccount,
  ) => dx.getSellerBalancesOfCurrentAuctions.call(sellTokenArr, buyTokenArr, userAccount)

  const getIndicesWithClaimableTokensForSellers = (
    sellAddr, buyAddr,
    userAccount,
    lastNAuctions = 0,
  ) => dx.getIndicesWithClaimableTokensForSellers.call(sellAddr, buyAddr, userAccount, lastNAuctions)

  const getFeeRatio = (userAccount) => dx.getFeeRatio.call(userAccount)

  const event = (
    eventName,
    valueFilter,
    filter,
    cb,
  ) => {
    const event = dx[eventName]

    if (typeof event !== 'function') throw new Error(`No event with ${eventName} name found on DutchExchange contract`)

    return event(valueFilter, filter, cb)
  }

  const allEvents = dx.allEvents.bind(dx)

  return {
    get address() {
      return dx.address
    },
    get contract() {
      return dx.contract
    },
    getApprovedTokens,
    getApprovedAddressesOfList,
    getBalances,
    getAuctionIndex,
    getAuctionStart,
    getClosingPrices,
    getPriceInPastAuction,
    getCurrentAuctionPrice,
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
