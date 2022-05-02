import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";

import req from "./requests";

const main = document.querySelector("#root");

main.innerHTML = "<h1>Welcome to Prunto</h1>";

window.addEventListener("load", () => {
  req.printRequests();
});
