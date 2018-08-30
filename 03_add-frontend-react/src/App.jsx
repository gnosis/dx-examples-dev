import React from 'react'
import { hot } from 'react-hot-loader'

import StateProvider from './components/StateProvider'
import WalletIntegration from './components/controls/WalletIntegration'
import Home from './components/display/Home'

const App = () => (
  <StateProvider>
    <WalletIntegration>
      <Home />
    </WalletIntegration>
  </StateProvider>
)

export default hot(module)(App)
