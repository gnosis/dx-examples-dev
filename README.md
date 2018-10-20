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

So the first one should be [Example 01: Build on top of the DX](https://github.com/gnosis/dx-examples-dev/tree/master/01_build-of-top-of-dx)

The complete list of examples is:
* [Example 01: Build on top of the DX](https://github.com/gnosis/dx-examples-dev/tree/master/01_build-of-top-of-dx):
  * Shows how to create a new project from scratch that depends on DutchX and 
    how you can **deploy the contracts** in a `ganache-cli` local node.
* [Example 02: Use DutchX as an Oracle](https://github.com/gnosis/dx-examples-dev/tree/master/02_use-dx-as-an-oracle): 
  * This example shows how to create your own contract and migrations that makes 
    use the DutchX.
  * In this example we will create a `Safe` contract to deposit fund. We will
    use the DutchX to help us estimate the price in `USD` for any token in our `Safe`.
* [Example 03a: React Frontend + DX Contracts](https://github.com/gnosis/dx-examples-dev/tree/master/03_add-frontend-react): 
  * This example runs you through how to create your own [React v16.xx](https://reactjs.org/blog/2017/09/26/react-v16.0.html) JS frontend app that interfaces with the DutchX.
  * We will migrate all contracts, init APIs and display it in our own React JS app
* [Example 03b: Barebones JS Frontend + DX Contracts](https://github.com/gnosis/dx-examples-dev/tree/master/03b_frontent_no_framework): 
  * This example runs you through how to create your own frameworkless, JS frontend app that interfaces with the DutchX.
  * We will migrate all contracts, init APIs and display it in our own barebones JS app 

# Give some feedback and help us improve the docs
If you follow the guide and you encounter any inconvenience, let us kwnow.

Pull requests are welcomed, and any feedback can be given in the 
[DutchX Gitter Channel](https://gitter.im/gnosis/DutchX).
