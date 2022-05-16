import BigNumber from "bignumber.js";
import { ERC20_DECIMALS } from "../helpers/constants";

import utils from "../helpers/utils";
import wallet from "./wallet";

let requests = [];

const getLoanRequests = async () => {
  const contract = wallet.getContract();
  const _loanRequestsLength = await contract.methods.getRequestsLength().call();
  const _loanRequests = [];
  for (let i = 0; i < _loanRequestsLength; i++) {
    let _loanRequest = new Promise(async (resolve, reject) => {
      let loanRequest = await contract.methods.getRequest(i).call();
      resolve({
        index: i,
        requester: loanRequest[0],
        amount: new BigNumber(loanRequest[1]),
        memo: loanRequest[2],
        accepted: loanRequest[3],
        denied: loanRequest[4],
      });
    });
    _loanRequests.push(_loanRequest);
  }
  requests = await Promise.all(_loanRequests);
};

const printLoanRequests = () => {
  let htmlString = "<h2>My Requests</h2>";
  htmlString += requests
    .filter((req) => !req.denied && !req.accepted)
    .map(
      (req) => `
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header">
          Request from ${utils.truncAddress(req.requester)}
        </div>
        <div class="card-body">
          <h5 class="card-title">$${req.amount.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD</h5>
          <p class="card-text">${req.memo}</p>
          <button id="req-${req.index}" class="btn btn-success acceptBtn">
            Send $${req.amount.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD
          </button>
          <button class="btn btn-danger">Deny</button>
        </div>
      </div>
    </div>
    `
    )
    .join();
  utils.writeToDom("#root", htmlString);
};

document.querySelector("#root").addEventListener("click", async (e) => {
  if (e.target.classList.contains("acceptBtn")) {
    const index = e.target.id.replace("req-", "");
    const request = requests[index];
    try {
      await wallet.approve(request.amount);
    } catch (error) {
      console.error(error);
    }
    try {
      await wallet.getContract().methods.acceptRequest(request.index).send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      console.error(error);
    }
    await getLoanRequests();
    printLoanRequests();
  }
});

document.querySelector("#requests").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoanRequests();
});

export default { printLoanRequests, getLoanRequests };
