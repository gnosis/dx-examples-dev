import React from 'react'
import { getAccount, getNetwork, getBalance } from '../api/providers'

const defaultState = {
  user: {
    account: 'CONNECTION ERROR',
    balance: undefined,
  },
  providerData: {
    activeProvider: undefined,
    network: 'NETWORK NOT SUPPORTED',
    providers: [],
  }
}

const { Provider, Consumer } = React.createContext(defaultState)

const setToContext = new WeakMap()
const memoizedContextValue = ({ state, grabUserState, registerProviders, setActiveProvider }) => {
  if (setToContext.has(state)) return setToContext.get(state)

  const contextValue = { state, grabUserState, registerProviders, setActiveProvider }
  setToContext.set(state, contextValue)
  return contextValue
}

class AppProvider extends React.Component {
  state = {
    ...defaultState
  }

  grabUserState = async provider => {
    const [account, network] = await Promise.all([
      getAccount(provider),
      getNetwork(provider),
    ])
    const balance = await getBalance(provider, account)
    return this.setState({ user: { account, balance }, providerData: { network, ...this.state.providerData } })
  }

  registerProviders = provider => this.setState({ providerData: { providers: [...provider, ...this.state.providerData.providers] } })
  setActiveProvider = providerName => this.setState({ providerData: { activeProvider: providerName, ...this.state.providerData,  } })

  render() {
    const { loading } = this.state
    return (
      <Provider value={memoizedContextValue(this)}>
        {
         /*
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
