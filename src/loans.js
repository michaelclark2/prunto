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
    });
  });
  loan = await _loan;
};

const printLoan = () => {
  let htmlString = "<h2>My Loan</h2>";
  if (loan.hasOwnProperty("issuer")) {
    htmlString += `
      <div class="card">
          <div class="card-body">
              <h5 class="card-title">Active Loan</h5>
              <p class="card-text">${loan.issuer}</p>
          </div>
      </div>
      `;
  } else {
    htmlString += `no active loan, click here to send a request`;
  }
  utils.writeToDom("#root", htmlString);
};

document.querySelector("#loans").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printLoan();
});

export default { printLoan, getLoan };
