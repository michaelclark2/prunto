import BigNumber from "bignumber.js";

import utils from "./utils";
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
    .map(
      (req) => `
    <div class="col-lg-8">
      <div class="card">
        <div class="card-header">
          Request from ${utils.truncAddress(req.requester)}
        </div>
        <div class="card-body">
          <h5 class="card-title">$${req.amount} cUSD</h5>
          <p class="card-text">${req.memo}</p>
          <a href="#" class="btn btn-success">Send $${req.amount} cUSD</a>
          <a href="#" class="btn btn-danger">Deny</a>
        </div>
      </div>
    </div>
    `
    )
    .join();
  utils.writeToDom("#root", htmlString);
};

document.querySelector("#requests").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoanRequests();
});

export default { printLoanRequests, getLoanRequests };
