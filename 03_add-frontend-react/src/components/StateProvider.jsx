import React from 'react'
import { getAccount, getNetwork, getBalance } from '../api/providers'
import { getTokensAPI } from '../api/Tokens'
import { getDutchXAPI } from '../api/DutchX'

const defaultState = {
  USER: {
    account: 'CONNECTION ERROR',
    balance: undefined,
  },
  PROVIDER: {
    activeProvider: undefined,
    network: 'NETWORK NOT SUPPORTED',
    providers: [],
  },
  DX: {
    tokens: undefined,
  },
}

const { Provider, Consumer } = React.createContext(defaultState)

const setToContext = new WeakMap()
const memoizedContextValue = ({ state, grabUserState, grabDXState, registerProviders, setActiveProvider, getDXTokenBalance }) => {
  if (setToContext.has(state)) return setToContext.get(state)

  const contextValue = { state, grabUserState, grabDXState, registerProviders, setActiveProvider, getDXTokenBalance }
  setToContext.set(state, contextValue)
  return contextValue
}

class AppProvider extends React.Component {
  state = {
    ...defaultState,
  }

  // DutchX Functions
  getDXTokenBalance = async (tokenAddress, userAccount) => {
    const { getTokenSymbol } = await getTokensAPI()
    const { getDXTokenBalance } = await getDutchXAPI()

    const [symbol, balance] = await Promise.all([
      getTokenSymbol(tokenAddress),
      getDXTokenBalance(tokenAddress, userAccount),
    ])
    return this.setState({
      DX: {
        ...this.state.DX,
        tokens: {
          [tokenAddress]: {
            symbol,
            balance: balance.toString(),
          },
        },
      },
    })
  }

  setActiveProvider = providerName => this.setState({ PROVIDER: { activeProvider: providerName, ...this.state.PROVIDER } })

  grabDXState = async () => {
    const { getFRTAddress, getOWLAddress, getPriceFeedAddress } = await getDutchXAPI()
    const [frtTokenAddress, owlTokenAddress, priceFeedAddress] = await Promise.all([
      getFRTAddress(),
      getOWLAddress(),
      getPriceFeedAddress(),
    ])
    return this.setState({
      DX: {
        tokenFRT: {
          address: frtTokenAddress,
          ...this.state.DX.tokenFRT,
        },
        tokenOWL: {
          address: owlTokenAddress,
          ...this.state.DX.tokenOWL,
        },
        priceFeed: priceFeedAddress,
        ...this.state.DX,
      },
    })
  }

  registerProviders = provider => this.setState({ PROVIDER: { providers: [...provider, ...this.state.PROVIDER.providers] } })

  grabUserState = async (provider) => {
    const [account, network] = await Promise.all([
      getAccount(provider),
      getNetwork(provider),
    ])
    const balance = await getBalance(provider, account)
    return this.setState({ USER: { account, balance }, PROVIDER: { network, ...this.state.PROVIDER } })
  }

  render() {
    const { loading } = this.state
    return (
      <Provider value={memoizedContextValue(this)}>
        {/*
          * Printing state - runs into circular JSON stringify errors
          process.env.NODE_ENV === 'development' && (
            <pre style={{ position: 'fixed', bottom: 0, left: 0, zIndex: 99, backgroundColor: '#e0e0ecc9' }}>
              {JSON.stringify(this.state, null, 2)}
            </pre>
          )
         */}
        {loading ? null : this.props.children}
      </Provider>
    )
  }
}

export const connect = (mapContextToProps = ctx => ctx) => WrapComponent =>
  props => (
    <Consumer>
      {context => <WrapComponent {...props} {...mapContextToProps(context)} />}
    </Consumer>
  )

export default AppProvider
