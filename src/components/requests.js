import BigNumber from "bignumber.js";
import { ERC20_DECIMALS } from "../helpers/constants";

import utils from "../helpers/utils";
import wallet from "./wallet";

let requests = [];

const getLoanRequests = async () => {
  const contract = wallet.getContract();
  let _loanRequestsLength = 0;
  try {
    const _loanRequestsLength = await contract.methods.getRequestsLength().call();
  } catch (error) {
    // suppressing error if user has no requests
  }
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
  let htmlString = `<div class="row gy-2 gx-2-lg row-cols-1 row-cols-lg-4 justify-content-center-sm">`;
  htmlString += requests
    .filter((req) => !req.denied && !req.accepted)
    .map(
      (req) => `
    <div class="col">
      <div class="card">
        <h6 class="card-header">Request from ${utils.truncAddress(req.requester)}</h6>
        <div class="card-body">
          <p class="fs-2">$${req.amount.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD</p>
          <p class="card-text">${req.memo}</p>
          <button id="req-${req.index}" class="btn btn-success acceptBtn">
            Send $${req.amount.shiftedBy(-ERC20_DECIMALS).toFixed(2)} cUSD
          </button>
          <button id="req-${req.index}" class="btn btn-danger denyBtn">Deny</button>
        </div>
      </div>
    </div>
    `
    )
    .join("");
  if (requests.length == 0) {
    htmlString = `
    <div class="row">
      <div class="col-lg-6 mx-auto">
        <div class="card">
          <h6 class="card-header">No requests found</h6>
          <div class="card-body">
            <p class="card-text">No active requests, share your address with your friends so they may request payments.</p>
          </div>
        </div>
      </div>
    </div>
    `;
  }
  htmlString += "</div>";
  utils.writeToDom("#root", htmlString);
};

const handleLoanRequestClickEvents = async (e) => {
  if (e.target.classList.contains("acceptBtn")) {
    const index = e.target.id.replace("req-", "");
    const request = requests[index];
    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Approving`;
      await wallet.approve(request.amount);
    } catch (error) {
      console.error(error);
    }
    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Confirming`;
      await wallet.getContract().methods.acceptRequest(request.index).send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      console.error(error);
    }
    wallet.getBalance();
    await getLoanRequests();
    printLoanRequests();
  }

  if (e.target.classList.contains("denyBtn")) {
    const index = e.target.id.replace("req-", "");
    const request = requests[index];

    try {
      await wallet.getContract().methods.denyRequest(request.index).send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      console.error(error);
    }
    await getLoanRequests();
    printLoanRequests();
  }
};

document.querySelector("#requests").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoanRequests();
});

export default { printLoanRequests, getLoanRequests, handleLoanRequestClickEvents };
