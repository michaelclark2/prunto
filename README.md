# Prunto

## Description

A dApp built on [Celo](https://www.celo.org) to send requests for money to your friends that you intend to pay back later.

The lender can request the borrower pay an interest rate, or to pay the loan back interest-free.

A borrower can only have one active loan.

## Usage

### Requirements

- [Google Chrome](https://www.google.com/chrome)
- [Celo Wallet Extension](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh)
- [Node 16+](https://nodejs.org/en/download/)

### Setup Test Wallet

- Create a wallet using Celo Wallet Extension
- Change wallet to Alfajores Test Network
- Go to [Celo Faucet](https://celo.org/developers/faucet) and enter your address to receive tokens

### Steps to Run

- Clone down repo

  `git clone https://github.com/michaelclark2/prunto.git`

  `cd prunto`

- Install dependencies

  `npm install`

- Build frontend and start webpack-dev-server

  `npm start`
