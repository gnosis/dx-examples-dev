# Example 03b: Build a vanilla JS frontend to interface the DutchX contracts
This project is an example that shows how to create a simple JS frontend project 
that depends on the DutchX and how you can deploy the DutchX contracts in a 
`ganache-cli` local node.

> This example is part of the guide http://dutchx.readthedocs.io/en/latest/
>
> You can find other examples in the [Build on top of DutchX project](https://github.com/gnosis/dx-examples-dev)

## High level recommendations
1. Install and familiarise yourself with [MetaMask](https://metamask.io)
2. Testing Solidity contract methods can be tricky without the proper environment. Please check out and add the awesome [DutchX CLI](https://github.com/gnosis/dx-examples-cli) to your arsenal. `truffle console` is also very handy!

----------------------------------

## Initial setup and starting the app locally
First you'll need to grab the project!
```bash
mkdir dx-dapp-project && cd dx-dapp-project
git clone https://github.com/gnosis/dx-examples-dev.git .

# inside dx-examples-dev/03b_frontend_no_framework

# install the dependencies
npm install
```
If you intend to host a test blockchain locally (as opposed to interacting with already deployed contracts on a testnet)

```
# start ganache rpc!
npm run rpc

# (in another tab) migrate the contracts
npm run migrate
```

 and finally, start the thing in development mode
 head to localhost:1234 in your favorite browser (which is Chrome, right?)

```
npm start
```

Make sure Metamask is connected to a network with the contracts deployed: local ganache (if using one) or Rinkeby.

## Troubleshooting
Some issues that may arise:
1. `node-gyp permission error` or something similar - solution was found by setting npm config for unsafe-perm to true: `npm config set unsafe-perm true`

## Next steps
Congratulations! you now have a working vanilla JS frontend-truffle project that deploys all the DutchX contracts as 
part of it's first migration and can talk to them - doooope.

That's it for now! Please check back in every now and again and check for updates :) Thanks so much for stopping by and giving all this a go!

Happy buidling
