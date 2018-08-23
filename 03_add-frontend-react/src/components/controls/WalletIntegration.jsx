import React from 'react'

import Providers from '../../api/providers'

import { connect } from '../Provider'
import { getAPI } from '../../api'
import { getAppContracts } from '../../api/Contracts';

class WalletIntegration extends React.Component {
  state = {
    activeProviderSet: undefined,
    error: undefined,
    initialising: false,
    web3: undefined,
  }

  componentWillMount() {
    const { registerProviders } = this.props
    // returns [ Provider{}, ... ]
    const providersArray = Object.values(Providers)
    // register each providerObject into state
    return providersArray.forEach(provider => { registerProviders(providersArray) })
  }

  onChange = async providerInfo => {
    const { grabUserState, setActiveProvider } = this.props

    try {
      this.setState({ initialising: true, error: undefined })
      const chosenProvider = Providers[providerInfo]
      // initialize providers and return specific Web3 instances
      const web3 = await chosenProvider.initialize()

      // Save activeProvider to State
      setActiveProvider(providerInfo)
      // Save web3 provider + notify state locally
      this.setState({ web3, activeProviderSet: true })

      // interface with contracts & connect entire DX API
      await getAppContracts()
      await getAPI()
      
      await grabUserState(chosenProvider)

      return this.setState({ initialising: false })
    } catch (error) {
      console.error(error)
      return this.setState({ error, initialising: false })
    }
  }

  walletSelector = () => {
    return (
      <div className="walletChooser">
        <h1>Please select a wallet</h1>
        <div className={!this.state.initialising ? 'lightBlue' : ''}>
        {Object.keys(Providers).map((provider, i) => {
          const providerInfo = Providers[provider].providerName || provider
          return (
            <div
              key={i}
              onClick={() => this.onChange(provider)}
            >
              <h4 className="providerChoice">{`${i+1}. ${providerInfo}`}</h4>
            </div>
          )
        })}
        </div>
        {this.state.error && <h3>{this.state.error.message}</h3>}
      </div>
    )
  }

  render() {
    const { initialising, activeProviderSet } = this.state,
      { activeProvider, children } = this.props
    return (activeProvider && activeProviderSet) && !initialising ? children : this.walletSelector()
  }
}

const mapState = ({
  // state properties
  state: { 
    providerData: { activeProvider, network }, 
    user: { account, balance } 
  },
  // dispatchers
  grabUserState,
  registerProviders,
  setActiveProvider,
}) => ({
  // state properties
  activeProvider,
  network,
  account,
  balance,
  // dispatchers
  grabUserState,
  registerProviders,
  setActiveProvider,
})

export default connect(mapState)(WalletIntegration)
