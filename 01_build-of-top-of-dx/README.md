# Example 01: Build on top of the DX
This project is an example that shows how to create a new project from scratch 
that depends on DutchX and how you can deploy the DutchX contracts in a 
`ganache-cli` local node.

> This example is part of the guide http://dutchx.readthedocs.io/en/latest/
>
> You can find other examples in the [Build on top of DutchX project](https://github.com/gnosis/dx-examples-dev)

## Create a basic truffle contract
Create your `my-cool-app` project:
```bash
mkdir my-cool-app
cd my-cool-app
npm init
git init
touch .gitignore
# Edit .gitignore
#   add at least: "node_modules" and "build" dirs
```

Make it a truffle project:
```bash
npm install truffle@4.1.5 --save-dev
npm install truffle-contract@^3.0.6 truffle-hdwallet-provider@^0.0.5 --save
mkdir contracts migrations
```

> We set up a fixed version for truffle, so the compiler is the same that the
> dx used.
>
> Probably works with more modern versions of truffle, we probably a good a idea
> to remove posible breaking points..


Add a truffle config:
* Add [truffle.js](./truffle.js) into the root of the project.

Add the first migration and it's contract:
* [Migrations.sol](./contracts/Migrations.sol) into `contracts` dir
* [1_initial_migration.js](./migrations/1_initial_migration.js) into `migrations` dir

## Make sure we compile all the DutchX
To ensure that for local development, truffle finds all DutchX contract, we can
create a dummy contract call `CoolAppDependencies`.

This contract won't do anything, we don't even use it, the important thing is 
that it must import `@gnosis.pm/dx-contracts/contracts/DxDevDependencies.sol` so
truffle will pull and compile all the required contracts.

Check the code of the contract [here](./contracts/CoolAppDependencies.sol).

Now, if we compile the contracts, we'll see how the `DutchExchange` is being 
compiled among all the other contracts it depends on:

```bash
npx truffle compile
````

## Add a new migration for the DutchX
Add the required dependencies
```bash
npm install @gnosis.pm/dx-contracts --save
```

Then we create a migration that deploys the `DutchX` and it's dependencies, an 
easy way would would be to create a migration that:
* Only executes in the `development` network. Note that `rinkeby` and `mainet` 
contracts are already deployed.
* Uses the contracts that are in our NPM dependencies, so we avoid repetition.
* Uses the migration scripts that are in our NPM dependencies. **DutchX** NPM 
module provides a simple migration source that can be referenced to ease the 
local development.
* So we just create a migration like 
[2_DEV_migrate_dependencies.js](./migrations/2_DEV_migrate_dependencies.js) and 
add it to the `migrations` dir.

## Apply the migrations
```bash
# Install ganache
npm install -g ganache-cli

# Run a ganache cli
ganache-cli -d

# Run migrations
#   It's also a good idea to add it a a package.json script
npx truffle migrate
```

## Next steps
Congratulations! you now have a truffle project that deploys all the DutchX contracts as 
part of it's first migration.

Now you can continue with [Example 02: Use DutchX as an Oracle](https://github.com/gnosis/dx-examples-dev/tree/master/02_use-dx-as-an-oracle): 
* This example shows how to create your own contract and migrations that makes 
use of the DutchX.
* In this example we will create a `Safe` contract to deposit fund. We will
use the DutchX to help us estimate the price in `USD` for any token in our 
`Safe`.
