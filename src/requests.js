import utils from "./utils";
import wallet from "./wallet";

let requests = [];

const getLoanRequests = async () => {
  const _loanRequestsLength = await wallet
    .getContract()
    .methods.getRequestsLength()
    .call();
  const _loanRequests = [];
  for (let i = 0; i < _loanRequestsLength; i++) {
    let _loanRequest = new Promise(async (resolve, reject) => {
      let loanRequest = await contract.methods.getRequest(i).call();
      resolve({
        index: i,
        requestor: loanRequest[0],
        amount: loanRequest[1],
        memo: loanRequest[2],
        accepted: loanRequest[3],
        denied: loanRequest[4],
      });
    });
    _loanRequests.push(_loanRequest);
  }
  requests = await Promise.all(_loanRequests);
  printRequests();
};

const printRequests = () => {
  let htmlString = "<h2>Requests</h2>";
  htmlString += requests
    .map(
      (req) => `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Request</h5>
            <p class="card-text">text</p>
        </div>
    </div>
    `
    )
    .join();
  utils.writeToDom("#root", htmlString);
};

document.querySelector("#requests").addEventListener("click", async (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  await getLoanRequests();
});

export default { printRequests, getLoanRequests };
