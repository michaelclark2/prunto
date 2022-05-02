import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import req from "./requests";
import loans from "./loans";
import wallet from "./wallet";
import utils from "./utils";

const main = document.querySelector("#root");

main.innerHTML = "<h1>Welcome to Prunto</h1>";

document.querySelector("#requests").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  req.printRequests();
});

document.querySelector("#loans").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  loans.printLoans();
});

document.querySelector("#about").addEventListener("click", (e) => {
  e.preventDefault();
  utils.clearActiveNavlinks();
  e.target.classList.add("active");
  utils.writeToDom("#root", "<h2>About</h2>");
});

window.addEventListener("load", async () => {
  await wallet.connectWallet();
});
