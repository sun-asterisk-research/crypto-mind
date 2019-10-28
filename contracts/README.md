<h1 align="center">Welcome 👋</h1>
<p>
  <img src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

## Install

```sh
yarn
```

## Build

Run loom before

```sh
yarn truffle build
```

## Config Env

Enter your MNEMONIC in `.env.example` then rename to `.env`

## Deploy

```sh
yarn truffle migrate --network tomotestnet
```

## Run tests

We use [ganache-cli](https://docs.nethereum.com/en/latest/ethereum-and-clients/ganache-cli/)

```sh
ganache-cli

yarn truffle test --network development
```

## Run tests Coverage

```sh
./node_modules/.bin/solidity-coverage
```

## Show your support

Give a ⭐️ if this project helped you!

---
