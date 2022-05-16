import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import utils from "./utils";
import pruntoAbi from "../contracts/prunto.abi.json";

const ERC20_DECIMALS = 18;
const PruntoContractAddress = "0x644eaF572Cffc97a795CACC7F22FeB9308fC5fA0";

let kit;
let contract;

const getContract = () => contract;

// TODO: handle disconnect

const connectWallet = async () => {
  if (window.celo) {
    try {
      const accounts = await window.celo.enable();
      const web3 = new Web3(window.celo);

      kit = newKitFromWeb3(web3);
      kit.defaultAccount = accounts[0];

      contract = new kit.web3.eth.Contract(pruntoAbi, PruntoContractAddress);

      utils.showWallet();
      getBalance();
    } catch (error) {
      console.error(error);
    }
  }
};

const getBalance = async () => {
  const totalBalance = await kit.getTotalBalance(kit.defaultAccount);
  const cUSDBalance = totalBalance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
  document.querySelector("#balance").textContent = `$${cUSDBalance} cUSD`;
};

document.querySelector("#wallet").addEventListener("click", async (e) => {
  e.preventDefault();
  await connectWallet();
});

export default { connectWallet, getContract };
