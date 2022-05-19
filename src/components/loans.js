import BigNumber from "bignumber.js";
import utils from "../helpers/utils";
import wallet from "./wallet";
import { ERC20_DECIMALS } from "../helpers/constants";

let loan = {};

const getLoanDetail = () => loan;

const getLoan = async () => {
  const contract = wallet.getContract();
  const _loan = new Promise(async (resolve, reject) => {
    const loan = await contract.methods.getLoan().call();
    resolve({
      issuer: loan.issuer,
      amount: new BigNumber(loan.amount),
      balance: new BigNumber(loan.balance),
    });
  });
  loan = await _loan;
};

const printLoan = () => {
  let htmlString = `<div class="row justify-content-center"><div class="col-lg-6">`;
  if (loan.issuer && !utils.isEmptyAddress(loan.issuer)) {
    htmlString += `
        <div class="card" id="loanView">
          <h6 class="card-header">Active loan from ${utils.truncAddress(loan.issuer)}</h6>
          <div class="card-body">
            <div class="row gy-4">
              <div class="col">
                <h5 class="card-title">$${loan.amount.shiftedBy(-ERC20_DECIMALS)}</h5>
                <p class="card-text">Loan Amount</p>
              </div>
              <div class="col">
                <h5 class="card-title">$${loan.balance.shiftedBy(-ERC20_DECIMALS)}</h5>
                <p class="card-text">Current balance</p>
              </div>
              <div class="col-12">
                <div class="input-group">
                  <span class="input-group-text">$</span>
                  <input
                    type="number" step="0.01" min=0 max=${loan.balance.shiftedBy(-ERC20_DECIMALS)}
                    id="makePaymentAmount" class="form-control" placeholder="0.00"
                  />
                  <button id="makePaymentBtn" class="btn btn-outline-success">Pay balance</button>
                  <button id="payRemainingBalanceBtn" class="btn btn-outline-success">Pay in full</button>
                </div>
              </div>
              <div class="col-12">
                <div class="alert alert-danger" style="display:none;"></div>
              </div>
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
                <input type="text" class="form-control" id="loanReqAddress" placeholder="Address">
              </div>
              <div class="col-lg mb-2">
                <input type="number" step="0.01" min=0 class="form-control" id="loanReqAmount" placeholder="Amount">
              </div>
              <div class="col-lg mb-2">
                <input type="text" class="form-control" id="loanReqMemo" placeholder="What is the loan for?">
              </div>
            </div>
            <div class="row text-center mb-2">
              <div class="col">
                <button class="btn btn-success" id="sendLoanRequestBtn">Send Request</button>
              </div>
            </div>
            <div class="alert alert-danger" style="display:none;"></div>
          </form>
        </div>
      </div>
    </div>
    `;
  }
  htmlString += "</div></div>";
  utils.writeToDom("#root", htmlString);
};

const errorNotification = (message) => {
  document.querySelector(".alert").style.display = "block";
  document.querySelector(".alert").innerHTML = message;
};

document.querySelector("#loans").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoan();
});

const handleLoanPaymentClickEvents = async (e) => {
  e.preventDefault();
  if (e.target.id === "payRemainingBalanceBtn") {
    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Approving`;
      await wallet.approve(loan.balance);
    } catch (error) {
      errorNotification(error);
    }

    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Confirming`;
      await wallet.getContract().methods.payRemainingBalance().send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      errorNotification(error);
    }
    wallet.getBalance();
    await getLoan();
    printLoan();
  }

  if (e.target.id === "sendLoanRequestBtn") {
    e.preventDefault();
    const newLoanRequestParams = [
      document.querySelector("#loanReqAddress").value,
      new BigNumber(document.querySelector("#loanReqAmount").value).shiftedBy(ERC20_DECIMALS).toString(),
      document.querySelector("#loanReqMemo").value,
    ];
    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Confirming`;
      const result = await wallet
        .getContract()
        .methods.sendRequest(...newLoanRequestParams)
        .send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      errorNotification(error);
    }
    await getLoan();
    printLoan();
  }

  if (e.target.id === "makePaymentBtn") {
    e.preventDefault();
    const paymentAmount = new BigNumber(document.querySelector("#makePaymentAmount").value)
      .shiftedBy(ERC20_DECIMALS)
      .toString();
    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Approving`;
      await wallet.approve(paymentAmount);
    } catch (error) {
      errorNotification(error);
    }

    try {
      e.target.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>Confirming`;
      const result = await wallet
        .getContract()
        .methods.makePayment(paymentAmount)
        .send({ from: wallet.getKit().defaultAccount });
    } catch (error) {
      errorNotification(error);
    }
    wallet.getBalance();
    await getLoan();
    printLoan();
  }
};

export default { printLoan, getLoan, handleLoanPaymentClickEvents, getLoanDetail };
