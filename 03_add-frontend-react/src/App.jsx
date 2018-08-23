import React from 'react'
import { hot } from 'react-hot-loader'

import Provider from './components/Provider'
import WalletIntegration from './components/controls/WalletIntegration'

const App = () => (
  <Provider>
    <WalletIntegration>
      <div> Hello world! </div>
    </WalletIntegration>
  </Provider>
)

export default hot(module)(App)
