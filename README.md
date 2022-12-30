# Simple ACL Close Example

## About
A super simple foundry/Hardhat hybrid project which utilizes Superfluid's CFA Access Control List feature and Gelato to close a flow at a predetermined time in the future.

## Built With

- [@superfluid-finance/ethereum-contracts](https://www.npmjs.com/package/@superfluid-finance/ethereum-contracts)
- [@superfluid-finance/sdk-core](https://www.npmjs.com/package/@superfluid-finance/sdk-core)
- [foundry](https://github.com/foundry-rs/foundry)
- [Hardhat](https://hardhat.org/)
- [Gelato Ops](https://app.gelato.network/)

## Prerequisites
In order to run this project, you need to have the following dependencies installed on your computer:

- [foundry](https://github.com/foundry-rs/foundry)
- [yarn](https://yarnpkg.com/getting-started/install) or you can just use npm, but you'll need to change up the `Makefile` slightly. 

## Project Setup
To set up the project run the following command:
```ts
yarn // installing the node_modules
```
```ts
yarn compile // compiling with hardhat the project
```



## Deployment, creating the stream, authorizing, creating the task and mock the execution

### Local on a forked network 
Copy the .env.template--> and enter your private jey, infura Id and Etherscan if required 
We will open a second terminal and run:

```ts
yarn fork // fork the network into a local hardhat node
```

Contract deploy:
```ts
yarn deploy localhost
```
The console will log something like:

```ts
Close Sream deployed succsessfully at:  0xCC7FA88DB7df720EA72872ad7C19fd85026047d9
```
We will copy the deployed address into the './scripts/Helpers.ts' so it will be available later.

```ts
export const CloseStreamAddress = "0xCC7FA88DB7df720EA72872ad7C19fd85026047d9";
```

We will now start a stream
```ts
yarn startStream localhost    // in scripts/startStream.ts 
```

Authorize our smart contract to stop the stream
```ts
yarn authorizeControl  localhost   // in scripts/authorizeControl.ts 
```

Create the task
```ts
yarn createTaskStopStream  localhost   // in scripts/createTaskStopStream.ts 
```

We are goig to mock the Gelato execution, so we will need exactly the start time of the task, when deplpoying on goerli we wont require it as the executiojn will be done by the Gelato executors

```ts
eth_sendTransaction
  Contract call:       CloseStream#createCloseStreamTask
  Transaction:         0x079cd1d093a7b9b093df487af947088b7502637d2a55592c9fd4cafba135f2e3
  From:                0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
  To:                  0xcc7fa88db7df720ea72872ad7c19fd85026047d9
  Value:               0 ETH
  Gas used:            202686 of 202686
  Block #7850260:      0xb649932d9314e7d02697e63ce31fccde93580b0cb6c3db7c5fb853fb5b74b2cf

  console.log:
    1666974177
```

We copy the timestamp '1666974177' into the stopStreamscript and we mock the gelato execution:
```ts
yarn stopStream localhost
```

### Goerli

Contract deploy:
```ts
yarn deploy goerli
```
The console will log something like:

```ts
Close Sream deployed succsessfully at:  0xCC7FA88DB7df720EA72872ad7C19fd85026047d9
```
We will verify our contract to interact later with etherscan
```ts
yarn verify goerli  // in scripts/verify.ts 
```

We will copy the deployed address into the './scripts/Helpers.ts' so it will be available later.

```ts
export const CloseStreamAddress = "0xCC7FA88DB7df720EA72872ad7C19fd85026047d9";
```

We will now start a stream
```ts
yarn startStream goerli  // in scripts/startStream.ts 
```

Authorize our smart contract to stop the stream
```ts
yarn authorizeControl  goerli  // in scripts/authorizeControl.ts 
```

Create the task
```ts
yarn createTaskStopStream  goerli   // in scripts/createTaskStopStream.ts 
```

and thats it, we will wait 