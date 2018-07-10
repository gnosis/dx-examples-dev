# Example 02: Setup the project
This example shows how to add new migrations to deploy your own 
contracts, and how to **setup the DutchX**. For example for listing your own token 
pair.

> This example is part of the guide http://dutchx.readthedocs.io/en/latest/
>
> You can find other examples in the [Build on top of DutchX project](https://github.com/gnosis/dx-example-build-on-top-of-dutchx)

## First things first
If you haven't done so, you have to complete firts the 
[Example 01: Build on top of the DX](https://github.com/gnosis/dx-example-build-on-top-of-dutchx/tree/master/01_build-of-top-of-dx).

This second example starts from the `my-cool-app` code generated after 
completing the first example.

## Create your own migrations - 
Now that you have a truffle project that on his first migration deploys the dx
(only in local development), you can add your own.

For example you could create a contract that uses the DutchX 
