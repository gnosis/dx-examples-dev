import React from 'react'
import { connect } from '../Provider'

const Home = ({ account, balance: userBalance, network }) => (
    <div>
        <h3>Network: {network}</h3>
        <br/>
        <h3>Account: {account}</h3>
        <h3>Balance: {userBalance}</h3>
    </div>
)

const mapProps = ({ 
    state: {
        user: {
            account,
            balance,
        },
        providerData: { network },
    } 
}) => ({
    account,
    balance,
    network,
})

export default connect(mapProps)(Home)
