import BigNumber from "bignumber.js";
import utils from "./utils";
import wallet from "./wallet";

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
  let htmlString = `<div class="row align-items-center">`;
  if (loan.issuer && !utils.isEmptyAddress(loan.issuer)) {
    htmlString += `
      <div class="col-lg-8">
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
      </div>
      `;
  } else {
    htmlString += `no active loan, click here to send a request`;
  }
  htmlString += "</div>";
  utils.writeToDom("#root", htmlString);
};

const printRequestForm = () => {
  return `
    <div>
    </div>
  `;
};

document.querySelector("#loans").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoan();
});

export default { printLoan, getLoan };
