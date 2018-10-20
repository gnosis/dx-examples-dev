<p align="center">
  <img width="350px" src="http://dutchx.readthedocs.io/en/latest/_static/DutchX-logo_blue.svg" />
</p>

# Build on top of the DutchX
This project is a series of examples on how to build applications on top of the
DutchX.

All the guides, and reference documentation can be found in:
* [http://dutchx.readthedocs.io/en/latest/](http://dutchx.readthedocs.io/en/latest/)

## Start from the begining
So the examples are part of a guide and you are suppouse to do them in order.

So the first one should be [Example 01: Build on top of the DX](https://github.com/gnosis/dx-examples-dev/tree/master/02_truffle-migrate)

The complete list of examples is:
* [Example 01: Basic Web - Deposit](https://github.com/gnosis/dx-examples-dev/tree/master/01_basic-web-deposit):
  * This example shows were to find the contracts and how to integrate it in a
    basic app.
  * It also shows how the desposit works. This operation is very important, 
    because it allowes users to have balance in the DutchX, so you can submit
    sell/buy orders or add token pairs.
  * The example is a basic React web app with an input and some buttons, that
    allows the user to deposit tokens into the DutchX.
* [Example 02: Truffle Migrate](https://github.com/gnosis/dx-examples-dev/tree/master/02_truffle-migrate):
  * Shows how to create a new project from scratch that depends on DutchX and 
    how you can **deploy the contracts** in a `ganache-cli` local node.
* [Example 03: Onchain usage - Use it as an oracle](https://github.com/gnosis/dx-examples-dev/tree/master/03_onchain-usage-oracle): 
  * This example shows how to create your own contract and migrations that makes 
    use the DutchX.
  * This example creates a `Safe` contract to deposit funds. It uses the DutchX
    to get an estimate of the price in `USD` for any token in the `Safe`
    contract.
* [Example 04: React Web - Boilerplate and API ](https://github.com/gnosis/dx-examples-dev/tree/master/04_react-web-api): 
  * This example runs you through how to create your own [React v16.xx](https://reactjs.org/blog/2017/09/26/react-v16.0.html) JS frontend app that interfaces with the DutchX.
  * We will migrate all contracts, init APIs and display it in our own React JS app
* [Example 05: Vanilla JS Web - Boilerplate and API](https://github.com/gnosis/dx-examples-dev/tree/master/05_vanilla-web-api): 
  * This example runs you through how to create your own frameworkless, JS frontend app that interfaces with the DutchX.
  * We will migrate all contracts, init APIs and display it in our own barebones JS app 

# Give some feedback and help us improve the docs
If you follow the guide and you encounter any inconvenience, let us kwnow.

Pull requests are welcomed, and any feedback can be given in the 
[DutchX Gitter Channel](https://gitter.im/gnosis/DutchX).
