import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import req from "./components/requests";
import loans from "./components/loans";
import wallet from "./components/wallet";
import utils from "./helpers/utils";
import { ERC20_DECIMALS } from "./helpers/constants";

const printHome = () => {
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

const initData = async () => {
  await req.getLoanRequests();
  await loans.getLoan();
  utils.notificationOff();
};

document.querySelector("#about").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  utils.writeToDom("#root", "<h2>About</h2>");
});

document.querySelector("#homeLink").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  printHome();
});

document.querySelector("#wallet").addEventListener("click", async (e) => {
  e.preventDefault();
  await wallet.connectWallet(initData);
  printHome();
});

document.querySelector("#root").addEventListener("click", async (e) => {
  await req.handleLoanRequestClickEvents(e);
  await loans.handleLoanPaymentClickEvents(e);
});

window.addEventListener("load", async () => {
  await wallet.connectWallet(initData);
  printHome();
});
