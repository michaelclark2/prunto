import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import req from "./components/requests";
import loans from "./components/loans";
import wallet from "./components/wallet";
import utils from "./helpers/utils";
import { ERC20_DECIMALS } from "./helpers/constants";

const printHomePage = () => {
  let htmlString = "<h1 class='text-center'>Welcome to Prunto</h1>";
  if (window.celo && window.celo.isConnected()) {
    const address = wallet.getKit().defaultAccount;
    const loan = loans.getLoanDetail();
    const requestsLength = req.getLoanRequestsLength();
    htmlString += `
      <div class="col col-lg-6 mx-auto">
        <div class="card">
          <div class="card-body text-center">
            <h3 class="card-title">Hello, ${utils.truncAddress(address)}!</h3>
            <p class="card-text">You have ${requestsLength} requests for payment.</p>
            <p class="card-text">
            ${
              loan.balance > 0
                ? `You have an active loan with a remaining balance of $${loan.balance.shiftedBy(-ERC20_DECIMALS)}.`
                : "You do not have an active loan."
            }
            </p>
          </div>
        </div>
      </div>
    `;
  } else {
    htmlString += `
    <div class="col-lg-6 mx-auto">
      <div class="card">
        <div class="card-body">
          <p class="card-text text-center">Connect your wallet to begin</p>
        </div>
      </div>
    </div>`;
  }
  utils.writeToDom("#root", htmlString);
};

const printAboutPage = () => {
  let htmlString = `<h2 class="text-center">About</h2>`;
  htmlString += `
    <div class="col-lg-6 mx-auto mb-2">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title text-center">What is Prunto?</h4>
          <p class="card-text">Prunto is intended to be used as a payment request and reimbursement platform.</p>
          <p class="card-text">A user can request a payment from an address and respond to requests for payment from other users.  If a payment request is accepted, a loan is created to track reimbursements.</p>
          <p class="card-text">While a user is currently borrowing from an address, they are unable to request any further payments until the original payment is reimbursed.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mx-auto mb-2">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title text-center">How do I borrow money?</h4>
          <p class="card-text">Send an address a request for payment.</p>
          <p class="card-text">If the payment request is accepted, the funds will be transfered to your address and a loan will be created.</p>
          <p class="card-text">While the user has an active loan, they are unable to request any further payments.</p>
        </div>
      </div>
    </div>
    <div class="col-lg-6 mx-auto mb-2">
      <div class="card">
        <div class="card-body">
          <h4 class="card-title text-center">How do I lend money?</h4>
          <p class="card-text">If you have an active request for payment, you can accept or deny the request.</p>
          <p class="card-text">If the payment request is accepted, the funds will be transfered from your address and a loan will be created.</p>
        </div>
      </div>
    </div>
  `;
  utils.writeToDom("#root", htmlString);
};

const initData = async () => {
  await req.getLoanRequests();
  await loans.getLoan();
  utils.notificationOff();
};

document.querySelector("#about").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  printAboutPage();
});

document.querySelector("#homeLink").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  printHomePage();
});

document.querySelector("#wallet").addEventListener("click", async (e) => {
  e.preventDefault();
  await wallet.connectWallet(initData);
  printHomePage();
});

document.querySelector("#root").addEventListener("click", async (e) => {
  await req.handleLoanRequestClickEvents(e);
  await loans.handleLoanPaymentClickEvents(e);
});

window.addEventListener("load", async () => {
  await wallet.connectWallet(initData);
  printHomePage();
});
