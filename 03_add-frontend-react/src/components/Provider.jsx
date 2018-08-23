import React from 'react'

const defaultState = {
  account: 'CONNECTION ERROR',
  network: 'NETWORK NOT SUPPORTED',
}

const { Provider, Consumer } = React.createContext(defaultState)

const setToContext = new WeakMap()
const memoizedContextValue = ({ state }) => {
  if (setToContext.has(state)) return setToContext.get(state)

  const contextValue = { state }
  setToContext.set(state, contextValue)
  return contextValue
}

class AppProvider extends React.Component {
  state = {
    ...defaultState
  }

  render() {
    const { loading } = this.state
    return (
      <Provider value={memoizedContextValue(this)}>
        {process.env.NODE_ENV === 'production' && (
          <pre style={{ position: 'fixed', top: '5vh', left: 0, zIndex: 99, backgroundColor: '#e0e0ecc9' }}>
            {JSON.stringify(this.state, null, 2)}
          </pre>
        )}
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
