import React from 'react'
import { connect } from '../StateProvider'

function parseArrays(...args) {
  return args.map((arg) => {
    if (/^\s*\[.+\]\s*$/.test(arg)) return JSON.parse(arg)
    return arg
  })
}

const Home = ({ account, balance: userBalance, dx, network, tokens, tokenFRT, tokenOWL, priceFeed }) => (
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

    <h3>DutchX Getter API</h3>
    <div id="apiContainer">
      {Object.values(dx.abi).map(({ name, inputs, stateMutability, type }, i) => {
        if (stateMutability === 'view' && type === 'function') {
          let funcInputs
          if (inputs.length) {
            funcInputs = inputs.map(input => input.type)
          }
          return (
            <form
              key={name + i}
              onSubmit={async (e) => {
                const elementToWrite = e.target.childNodes[2]
                e.preventDefault()

                let outputText
                let res
                try {
                  const preArgs = parseArrays(...new FormData(e.target).values())
                  const args = preArgs[0].split(',')
                  if (args.includes('')) {
                    res = await dx[name]()
                    outputText = res
                  } else {
                    res = await dx[name](...args)
                    outputText = res
                  }
                } catch (error) {
                  console.error(error)
                  outputText = `Error: ${error.message}`
                }
                elementToWrite.innerText = `>> ${outputText}`
              }}
            >
              <h4>{name}</h4>
              <input type="text" placeholder={funcInputs} name={name} />
              <h5 />
              <button> Submit </button>
            </form>
          )
        }
        return null
      })}
    </div>
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
    CONTRACTS: { dx },
  },
}) => ({
  account,
  balance,
  dx,
  network,
  priceFeed,
  tokens,
  tokenFRT,
  tokenOWL,
})

export default connect(mapProps)(Home)
