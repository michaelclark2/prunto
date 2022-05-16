import BigNumber from "bignumber.js";
import utils from "./utils";
import wallet from "./wallet";
import { ERC20_DECIMALS } from "./constants";

let loan = {};

const getLoan = async () => {
  const contract = wallet.getContract();
  const _loan = new Promise(async (resolve, reject) => {
    const loan = await contract.methods.getLoan().call();
    resolve({
      issuer: loan[0],
      amount: new BigNumber(loan[1]),
      balance: new BigNumber(loan[2]),
    });
  });
  loan = await _loan;
};

const printLoan = () => {
  let htmlString = `<div class="row justify-content-center"><div class="col-lg-8">`;
  if (loan.issuer && !utils.isEmptyAddress(loan.issuer)) {
    htmlString += `
        <div class="card">
          <div class="card-header">
            Active loan from ${utils.truncAddress(loan.issuer)}
          </div>
          <div class="card-body">
            <div class="row mb-2">
              <div class="col">
                <h5 class="card-title">$${loan.amount}</h5>
                <p class="card-text">Loan Amount</p>
                <button class="btn btn-success">Pay in full</button>
              </div>
              <div class="col">
                <h5 class="card-title">$${loan.balance}</h5>
                <p class="card-text">Current balance</p>
                <button class="btn btn-success">Make payment</button>
              </div>
            </div>
          </div>
        </div>
        `;
  } else {
    htmlString += `
    <div class="card">
      <div class="card-header">
        Send Request
      </div>
        <div class="card-body">
          <p class="card-text">
            No active loan, send a request to start using Prunto!
          </p>
          <form id="newLoanRequestForm">
            <div class="row">
              <div class="col-lg mb-2">
                <input type="text" class="form-control" id="address" placeholder="Address">
              </div>
              <div class="col-lg mb-2">
                <input type="number" step="0.01" min=0 class="form-control" id="amount" placeholder="Amount">
              </div>
              <div class="col-lg mb-2">
                <input type="text" class="form-control" id="memo" placeholder="What is the loan for?">
              </div>
            </div>
            <div class="row text-center mb-2">
              <div class="col">
                <button class="btn btn-success" id="sendLoanRequest">Send Request</button>
              </div>
            </div>
            <div class="alert alert-danger"></div>
          </form>
        </div>
      </div>
    </div>

    `;
  }
  htmlString += "</div></div>";
  utils.writeToDom("#root", htmlString);
  utils.notificationOff();
};

const errorNotification = (message) => {
  utils.notificationOn();
  utils.writeToDom("#newLoanRequestForm .alert", message);
};

document.querySelector("#loans").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoan();
});

document.querySelector("#root").addEventListener("submit", async (e) => {
  if (e.target.id === "newLoanRequestForm") {
    e.preventDefault();
    const form = e.target;
    const newLoanRequestParams = [
      form.address.value,
      new BigNumber(form.amount.value).shiftedBy(ERC20_DECIMALS).toString(),
      form.memo.value,
    ];
    try {
      const result = await wallet
        .getContract()
        .methods.sendRequest(...newLoanRequestParams)
        .send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      errorNotification(error);
    }
  }
});

export default { printLoan, getLoan };
