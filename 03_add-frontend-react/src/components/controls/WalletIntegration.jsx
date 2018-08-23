import React from 'react'

import Providers from '../../api/providers'

import { connect } from '../Provider'
import { getAPI } from '../../api'
import { getAppContracts } from '../../api/Contracts';
import { getWeb3API } from '../../api/ProviderWeb3';


class WalletIntegration extends React.Component {
  state = {
    activeProviderSet: undefined,
    error: undefined,
    initialising: false,
    web3: undefined,
  }

  async componentWillMount() {
    console.log('​WalletIntegration -> asynccomponentWillMount -> ', Providers);
  }

  onChange = async providerInfo => {
    const { setActiveProvider } = this.props

    try {
      this.setState({ initialising: true, error: undefined })
      // initialize providers and return specific Web3 instances
      const web3 = await Providers[providerInfo].initialize()

      this.setState({ web3, activeProviderSet: true })

      // interface with contracts & connect entire DX API
      await getAppContracts()
      await getAPI()

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
                <h4>{providerInfo}</h4>
                <br/>
                {/*<img
                src={provider2SVG(providerInfo)}
                style={{ minHeight: 26, maxHeight: 45, marginTop: -6 }}
                />*/}
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
      { /* activeProvider,  */children } = this.props
    return (/* activeProvider &&  */activeProviderSet) && !initialising ? children : this.walletSelector()
  }
}

/* const mapState = ({ blockchain: { activeProvider } }) => ({
  activeProvider,
}) */

export default connect()(WalletIntegration)
