# Prunto

## Description

Prunto is a payment request and reimbursement platform built on [Celo](https://www.celo.org).

A user can send request payments from any address that they intend to reimburse.

The lender can accept or deny a request.

If the lender accepts a payment request, a loan is created to keep track of reimbursement.

A borrower can only have one active loan at any given time, and is unable to make further payment requests until their loan balance is 0.

View dApp: https://fabulous-basbousa-dab8cb.netlify.app/

## Usage

### Requirements

- [Google Chrome](https://www.google.com/chrome)
- [Celo Wallet Extension](https://chrome.google.com/webstore/detail/celoextensionwallet/kkilomkmpmkbdnfelcpgckmpcaemjcdh)

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

## Future developments

- Add the ability for lenders to charge interest
- Request other tokens as payments
- View sent requests
- Lenders are able to see all current loans
