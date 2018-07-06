# Build on top of the DutchX
This project is an example on how to build on top of the DutchX.


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

Add a truffle config:
* Add [truffle.js](./truffle.js) into the root of the project.

Add the first migration and it's contract:
* [Migrations.sol](./contracts/Migrations.sol) into `contracts` dir
* [1_initial_migration.js](./migrations/1_initial_migration.js) into `migrations` dir

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