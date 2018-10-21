# Onchain integration: Oracle
This project shows how to create your own contract and migrations that makes 
use the DutchX.

It creates a `Safe` contract to deposit fund. We will use the DutchX 
to help us estimate the price in `USD` for any token in our `Safe`.

> This example is part of the guide http://dutchx.readthedocs.io/en/latest/
>
> You can find other examples in the [Build on top of DutchX project](https://github.com/gnosis/dx-examples-dev)

# First things first
If you haven't done so, you have to complete firts the 
[Example 02: Truffle Migrate](https://github.com/gnosis/dx-examples-dev/tree/master/02_truffle-migrate).

This second example starts from the `my-cool-app` code generated after 
completing the first example.

# Create your own contract
Now that you have a truffle project that deploys the dx on it's first migration 
(only in local development), you can add your own ones.

Let's say we want to create a contract called `Safe` that would allow it's owner to deposit
some [ERC20 tokens](https://github.com/ethereum/EIPs/blob/master/EIPS/eip-20.md) 
in there.

This contract could have the folowing operations:
* `deposit (address token, uint amount)`: Deposit an amount of any ERC20 token 
into the safe.
* `withdraw (address token, uint amount)`: Withdraw an amount of any ERC20 token
from the safe.

A basic implementation would be:
```js
pragma solidity ^0.4.21;

import "@gnosis.pm/util-contracts/contracts/Token.sol";

contract Safe {
    address public owner;
    mapping (address => uint) public balances;
    
    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }
    
    function Safe (address _dx) public {
        require(address(_dx) != address(0));
        
        owner = msg.sender;
    }
    
    function deposit (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0);
        require(Token(token).transferFrom(msg.sender, this, amount));
        
        balances[token] += amount;
        emit Deposit(token, amount);

        return amount;
    }
    
    function withdraw (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0);
        require(amount <= balances[token]);
        require(Token(token).transfer(msg.sender, amount));
        
        balances[token] -= amount;
        emit Withdraw(token, amount);

        return amount;
    }
   
    event Withdraw(
         address indexed token,
         uint amount
    );
    
    event Deposit(
         address indexed token,
         uint amount
    );
}
```

# Add DutchX as a dependency
Now that we have our basic implementation of the `Safe` contract, let's say we
want to return our balance, but instead of returing it in the currency of the 
token, we want to return it in `USD`.

It happens that **DutchX can be used as a price oracle**, and can tell you the 
closing price of any listed token pair. 

So let's add the dependency so our `Safe` contract can invoke any `DutchExchange`
operation. We can just follow this 4 steps:

```js
pragma solidity ^0.4.21;

// 1. Let's import the DutchExchange contract
import "@gnosis.pm/dx-contracts/contracts/DutchExchange.sol";

// ...

contract Safe {
    // 2. Declare the DX as a public variable
    DutchExchange public dx;

    // ...
    
    // 3. Add the DX address into the constructor of the contract
    function Safe (address _dx) public {
        require(address(_dx) != address(0));
        dx = DutchExchange(_dx);

        // ...
    }

    // 4. Provide a way of updating the dx contract
    function updateDutchExchange (DutchExchange _dx) public onlyOwner {
        dx = _dx;
    }

    // ...
}
```

Great! Now we have access from our contract to any **DutchX** logic.

# Use the DutchX logic
Now that we can invoke any DutchX logic, let's create a 
`getBalanceInUsd (address token)` function that returns the balance in `USD` 
as a pair of `uint`, being the first one the **numerator** and the second one 
**denominator** of the balance.
* The first thing that it does, is to get the price of the `token vs ETH` in the 
DutchX by using the function `getPriceOfTokenInLastAuction(token)`.
* The second thing is asking for the price of `ETH vs USD` using the 
`PriceOracleInterface` of the DutchX (that delegates to 
[MakerDao Medianizer](https://developer.makerdao.com/feeds/)).
* The third thing is to multiplied the balance and both prices.

This is how the function would look:

```js
// 1. We add the contract PriceOracleInterface
import "@gnosis.pm/dx-contracts/contracts/Oracle/PriceOracleInterface.sol";
// ...

contract Safe {
    // ...

    // 2. We create the function that uses DutchX as a price feed
    function getBalanceInUsd (address token) public view returns (uint, uint) {
        uint pricetNum;
        uint priceDen;
        // Get the price in ETH for a token
        (pricetNum, priceDen) = dx.getPriceOfTokenInLastAuction(token);

        // Get the price of ETH
        PriceOracleInterface priceOracle = PriceOracleInterface(dx.ethUSDOracle());
        uint etherUsdPrice = priceOracle.getUSDETHPrice();
        // uint etherUsdPrice = 400 ether;

        // Return the price in USD:
        //    balance * Price TOKEN-ETH * price ETH-USD
        uint balance = balances[token];
        return (balance * pricetNum * etherUsdPrice, priceDen);
    }
}
```

So we are done with the contract.

You can check the complete Safe contract [here](./contracts/Safe.sol).

## Add migrations for your new contract
To deploy our new contract, we depend on having deployed the **DutchX**,
since it's deployed in the migration `2_DEV_dependencies.js` we are good to go.

Create a new migration `migrations/3_deploy_safe.js`
with the folowing content:

```js
/* global artifacts */
/* eslint no-undef: "error" */

const Safe = artifacts.require("Safe")
const DutchExchangeProxy = artifacts.require("DutchExchangeProxy")

module.exports = function(deployer, network, accounts) {  
  const account = accounts[0]
  return deployer
    // Make sure DutchX is deployed
    .then(() => DutchExchangeProxy.deployed())

    // Deploy Safe contract
    .then(dxProxy => {
      console.log('Deploying Safe with %s as the owner and %s as the DutchExchange contract', account, dxProxy.address)
      return deployer.deploy(Safe, dxProxy.address)
    })
}
```

Execute the migrations (make sure you have `ganache-cli` running):
```bash
npx truffle migrate
```

If everything was smooth, you should have the `Safe` contract deployed and 
pointing to the `DutchExchangeProxy` address.

## Create some test setup for development
Sometimes it's usefull to add, in the migrations, some setup that should be done
only in the local `ganache-cli` node.

A easy way of solving this is adding the logic only for the network 
`development`:

```js
// ...

module.exports = function(deployer, network, accounts) {  

  if (network === 'development') {    
    // Here the setup only for development
    // ...
  }
}
```

So, let's setup the following:
* We will deposit `1 ether` in Wrapped Ether token (`WETH`) in our safe
* So, first we need to wrap `Ether` into the `EtherToken` contract
* Then, we use the ERC20 `approve` method to allow the safe to take the `WETH`.
* Finally, we do a `deposit` into the `Safe` contract.

This is how it would look:
```js
const ETH_TEST_AMOUNT = 1e18

// ...
module.exports = function(deployer, network, accounts) {  
  // ...

  const account = accounts[0]
  if (network === 'development') {    
    const EtherToken = artifacts.require("EtherToken")
  
    deployerPromise = deployerPromise
      .then(() => EtherToken.deployed())
      // Wrap 1 ETH for testing
      .then(weth => {
        console.log('Wrap %d ETH into WETH for account %s', ETH_TEST_AMOUNT / 1e18, account)
        return weth.deposit({ value: ETH_TEST_AMOUNT })
      })

      // Let the Safe take the 1 ETH (so we can deposit on it)
      .then(() => Safe.deployed())
      .then(() => EtherToken.deployed())      
      .then(weth => {
        console.log('Approve %d WETH for safe address %s', ETH_TEST_AMOUNT / 1e18, Safe.address)
        return weth.approve(Safe.address, ETH_TEST_AMOUNT)
      })

      // Deposit the WETH into the safe
      .then(() => Safe.deployed())
      .then(safe => {
        console.log('Deposit %d WETH (%s) into the safe %s',
          ETH_TEST_AMOUNT / 1e18,
          EtherToken.address,
          Safe.address
        )
        return safe.deposit(EtherToken.address, ETH_TEST_AMOUNT)
      })
  }
}
```


The final `migrations/3_deploy_safe.js` can be found 
[here](./migrations/3_deploy_safe.js).

Let's apply the migrations:
> NOTE: the `--reset` flag was added, because the `3_deploy_safe` migration was
> already applied.
```bash
npx truffle migrate --reset
```

# Check the result in the console
The `truffle console` is a great tool for developing:
```bash
npx truffle console
```

Now you can execute the folowing commands to verify that everything is working
as expected:

```js
// Get the Safe instance
Safe.deployed().then(s => safe = s)

// Get your account
web3.eth.getAccounts((error, accounts) => account = accounts[0])

// Get the DutchX instance
DutchExchangeProxy.deployed().then(p => proxy = p)

// Get the WETH instance
EtherToken.deployed().then(w => weth = w)

// Check the WETH balance of the user
// It should be 0 WETH since he had 1 WETH but it was deposited into the Safe
weth.balanceOf(account).then(n => console.log('WETH balance for user %s: %d ETH', account, n.toNumber() / 1e18))

// Check the WETH balance in the Safe contract for the user
// It should be 1 WETH
safe.balances.call(weth.address).then(n => console.log('Balance of WETH in the safe for %s: %d ETH', account, n.toNumber() / 1e18))

// Check the WETH balance in USD in the Safe contract for the user
// It should be 1100$
// NOTE: 
//    This prices comes from the price reported by the Medianizer, that is 
//    1100$ because is what it is set in the local deployment migrations, but can
//    be overrided for development.
safe.getBalanceInUsd.call(weth.address).then(([n, d]) => console.log('Blance of WETH: %d$', n.div(d).div(1e18).toNumber()))

// Let's withdraw 0.2 WETH
safe.withdraw(weth.address, 0.2e18)

// Check the WETH balance of the user
// It should be 0.2 WETH
weth.balanceOf(account).then(n => console.log('WETH balance for user %s: %d ETH', account, n.toNumber() / 1e18))


// Check the WETH balance in the Safe contract for the user
// It should be 0.8 WETH
safe.balances.call(weth.address).then(n => console.log('Balance of WETH in the safe for %s: %d ETH', account, n.toNumber() / 1e18))

// Check the WETH balance in USD in the Safe contract for the user
// It should be 880$
safe.getBalanceInUsd.call(weth.address).then(([n, d]) => console.log('Blance of WETH: %d$', n.div(d).div(1e18).toNumber()))
```

## Congratulations
Congratulations! Now you have deployed your own contracts that makes use of the
DutchX.

## Do you feel like continuing this example
This example was using the DutchX as an oracle in a very basic way. It's just
uses the price of the last auction for getting a price estimate. 

The DutchX has information about all the closing prices for all the auctions, 
also there are informations about trading volumes, closing dates, that could be
used to make a more sofisticated estimation.

Another interesting next step could be to check what other functinality could 
be interesting to use in your contracts 
([Checkout the contract](https://github.com/gnosis/dx-contracts/blob/master/contracts/DutchExchange.sol#L351)):
* i.e. Create a contract that submit sell orders and allow users to echange tokens
  onchain


## Are you still feeling creative?

* Share what are you doing in https://gitter.im/gnosis/DutchX, maybe someone 
  helps you out or can give you some feedback

Looking for ideas:
* https://dutchx.readthedocs.io/en/latest/integration-ideas.html


## Next steps
Congratulations! Now you have deployed your own contracts that makes use of the
DutchX.



Other interesting guides are:
* [Example 04: React Web - Boilerplate and API ](https://github.com/gnosis/dx-examples-dev/tree/master/04_react-web-api): 
  * This example runs you through how to create your own [React v16.xx](https://reactjs.org/blog/2017/09/26/react-v16.0.html) JS frontend app that interfaces with the DutchX.
  * We will migrate all contracts, init APIs and display it in our own React JS app
* [Example 05: Vanilla JS Web - Boilerplate and API](https://github.com/gnosis/dx-examples-dev/tree/master/05_vanilla-web-api): 
  * This example runs you through how to create your own frameworkless, JS frontend app that interfaces with the DutchX.
  * We will migrate all contracts, init APIs and display it in our own barebones JS app 