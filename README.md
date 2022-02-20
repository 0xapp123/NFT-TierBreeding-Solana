# EUS NFT SWAP
This project is swapping 2 NFTs in one collection(Tier1) to new NFT in other collection(Tier2).

## Backend

### Install Dependencies
- Install `node` and `yarn`
- Install `ts-node` as global command
- Confirm the solana wallet preparation: `/home/fury/.config/solana/id.json` in test case

### Usage
- Main script source for all functionality is here: `/cli/script.ts`
- Program account types are declared here: `/cli/types.ts`
- Idl to make the JS binding easy is here: `/cli/staking_program.json`

### Features

#### As a Smart Contract Owner
For the first time use, the Smart Contract Owner should `initialize` the Smart Contract for global account allocation.
- `initProject`
- `add`
 
#### Users
Users can use `breed` to swap 2 NFTs to another 1.
In this project, you can use params of `NFT addresses`, `wallet address`, and `tier`.
For example, if you want to swap 2 Tier1 NFTs to 1 Tier2, 
`breed(wallet.publicKey, new PublicKey('Hp..ZvG'), new PublicKey('m1..K2p'), 2)`


## Minimal-UI

### Install Dependencies
- Install `node` and `yarn`

### Usage
- Main script source for all functionality is here: `yarn start`

### Features
The UI has 3 parts: 
- Header(Heading, WalletConnect Button)
- NFT address List(According to the Tiers: Tier1, Tier2, Tier3)
- Swap(NFT address Inputs, Swap Button, New NFT address which you will receive)
