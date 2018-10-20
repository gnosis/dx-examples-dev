import React, { Component } from 'react'
import './App.css'
import web3 from './web3'

import abiDutchx from './abi-dutchx'
import abiWeth from './abi-weth'
const addressDutchx = '0x4e69969d9270ff55fc7c5043b074d4e45f795587'
const addressWeth = '0xc778417e063141139fce010982780140aa0cd5ab'


class App extends Component {
  state = {
    amount: '',
    message: null
  }

  deposit = async () => {
    const [ account ] = await web3.eth.getAccounts()
    const amount = this.state.amount

    // See: https://github.com/gnosis/dx-contracts/blob/master/contracts/DutchExchange.sol#L351
    const txReceipt = await this.dutchx.methods
      .deposit(addressWeth, web3.utils.toWei(amount))
      .send({
        from: account
      })

    const { transactionHash } = txReceipt
    this.setState({
      message: (
        <div>
          <p>Deposited { amount } WETH into the DutchX.</p>
          <p>See transaction in EtherScan:<br />
            <a href={ 'https://rinkeby.etherscan.io/tx/' + transactionHash }>{ transactionHash }</a></p>
        </div>
      )
    })
  }

  wrapEther = async () => {
    const [ account ] = await web3.eth.getAccounts()
    const amount = this.state.amount

    const txReceipt = await this.weth.methods
      .deposit()
      .send({
        from: account,
        value: web3.utils.toWei(amount)
      })

    const { transactionHash } = txReceipt
    this.setState({
      message: (
        <div>
          <p>Wraped { amount } Ether.</p>
          <p>See transaction in EtherScan:<br />
            <a href={ 'https://rinkeby.etherscan.io/tx/' + transactionHash }>{ transactionHash }</a></p>
        </div>
      )
    })
  }

  setAllowance = async () => {
    const [ account ] = await web3.eth.getAccounts()
    const amount = this.state.amount

    const txReceipt = await this.weth.methods
      .approve(addressDutchx, web3.utils.toWei(amount))
      .send({
        from: account
      })

    const { transactionHash } = txReceipt
    this.setState({
      message: (
        <div>
          <p>Allowance changed to { amount }.</p>
          <p>See transaction in EtherScan:<br />
            <a href={ 'https://rinkeby.etherscan.io/tx/' + transactionHash }>{ transactionHash }</a></p>
        </div>
      )
    })
  }

  getBalances = async () => {
    const [ account ] = await web3.eth.getAccounts()
    console.log('Get balances for %s', account)

    const etherBalancePromise = web3.eth
      .getBalance(account)
      .then(web3.utils.fromWei)

    const wethBalancePromise = this.weth.methods
      .balanceOf(account)
      .call()
      .then(web3.utils.fromWei)

    const wethAllowancePromise = this.weth.methods
      .allowance(account, addressDutchx)
      .call()
      .then(web3.utils.fromWei)

    // See https://github.com/gnosis/dx-contracts/blob/master/contracts/DutchExchange.sol#L74
    const dutchxBalancePromise = this.dutchx.methods
      .balances(addressWeth, account)
      .call()
      .then(web3.utils.fromWei)

    // Wait for all promises
    const [
      etherBalance,
      wethBalance,
      wethAllowance,
      dutchxBalance,
    ] = await Promise.all([
      etherBalancePromise,
      wethBalancePromise,
      wethAllowancePromise,
      dutchxBalancePromise,
    ])

    this.setState({
      message: (
        <div>
          <strong>Balances</strong>
          <ul>
            <li><strong>Ether</strong>: { etherBalance }</li>
            <li><strong>WETH balance</strong>: { wethBalance }</li>
            <li><strong>WETH allowance for DutchX</strong>: { wethAllowance }</li>
            <li><strong>Balance in DutchX</strong>: { dutchxBalance }</li>
          </ul>
        </div>
      )
    })
  }

  componentDidMount () {
    this.dutchx = new web3.eth.Contract(abiDutchx, addressDutchx)
    this.weth = new web3.eth.Contract(abiWeth, addressWeth)

    // Test to get some basic data
    this.dutchx.methods
      .auctioneer()
      .call()
      .then(auctioneer => {
        console.log('The DutchX Auctioneer is: %s', auctioneer)
      })
      .catch(console.error)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Deposit WETH into the DutchX</h1>

          <label>Amount of WETH:</label>
          <input          
            value={ this.state.amount }
            onChange={ event => this.setState({ amount: event.target.value }) }
            placeholder="Enter the amount..."
            />
          <button onClick={ this.getBalances }>Get balances</button>          
          <button onClick={ this.wrapEther }>Wrap Ether</button>
          <button onClick={ this.setAllowance }>Set allowance</button>
          <button onClick={ this.deposit }>Deposit</button>

          { this.state.message && (
            <div className="message">
              <span className="times" onClick={ () => this.setState({ message: null }) }>&times;</span>
              { this.state.message }
            </div>
          )}
        </header>
      </div>
    )
  }
}

export default App;


