import React from 'react'
import { hot } from 'react-hot-loader'

import Provider from './components/Provider'
import WalletIntegration from './components/controls/WalletIntegration'
import Home from './components/display/Home'

const App = () => (
  <Provider>
    <WalletIntegration>
      <Home />
    </WalletIntegration>
  </Provider>
)

export default hot(module)(App)
