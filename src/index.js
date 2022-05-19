import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import req from "./components/requests";
import loans from "./components/loans";
import wallet from "./components/wallet";
import utils from "./helpers/utils";

const printHome = () => {
  utils.writeToDom("#root", "<h1>Welcome to Prunto</h1>");
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
  printHome();
});

document.querySelector("#wallet").addEventListener("click", async (e) => {
  e.preventDefault();
  await wallet.connectWallet(initData);
});

document.querySelector("#root").addEventListener("click", async (e) => {
  await req.handleLoanRequestClickEvents(e);
  await loans.handleLoanPaymentClickEvents(e);
});

window.addEventListener("load", async () => {
  await wallet.connectWallet(initData);
});
