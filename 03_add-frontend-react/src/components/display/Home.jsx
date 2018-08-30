import React from 'react'
import { connect } from '../StateProvider'

const Home = ({ account, balance: userBalance, network, tokens, tokenFRT, tokenOWL, priceFeed }) => (
  <div>
    <h1>Provider state:</h1>

    <h3>Network: {network}</h3>
    <h3>Account: {account}</h3>
    <h3>Balance: {userBalance}</h3>

    <br /><br />

    <h1>Misc. DutchX state:</h1>

    <h3>DutchX Token Balances:</h3>
    <ol>
      {Object.keys(tokens).length && Object.keys(tokens).map(tokenAddr =>
        <li key={tokenAddr}>Symbol: {tokens[tokenAddr].symbol} \\ Balance: {tokens[tokenAddr].balance}</li>)}
    </ol>
    {tokenFRT && <h3>FRT Token Address: <a target="_blank" rel="noopener noreferrer" href={`https://${network === 'RINKEBY' ? 'rinkeby.' : ''}etherscan.io/token/${tokenFRT.address}`}>{tokenFRT.address}</a></h3>}
    {tokenOWL && <h3>OWL Token Address: <a target="_blank" rel="noopener noreferrer" href={`https://${network === 'RINKEBY' ? 'rinkeby.' : ''}etherscan.io/token/${tokenOWL.address}`}>{tokenOWL.address}</a></h3>}
    {priceFeed && <h3>Current Price Feed Address: <a target="_blank" rel="noopener noreferrer" href={`https://${network === 'RINKEBY' ? 'rinkeby.' : ''}etherscan.io/address/${priceFeed}`}>{priceFeed}</a></h3>}
  </div>
)

const mapProps = ({
  state: {
    USER: {
      account,
      balance,
    },
    PROVIDER: { network },
    DX: { tokens, tokenFRT, tokenOWL, priceFeed },
  },
}) => ({
  account,
  balance,
  network,
  tokens,
  tokenFRT,
  tokenOWL,
  priceFeed,
})

export default connect(mapProps)(Home)
