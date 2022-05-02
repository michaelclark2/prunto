const writeToDom = (id, htmlString) => {
  document.querySelector(id).innerHTML = htmlString;
};

const clearActiveNavlinks = () => {
  document
    .querySelectorAll(".nav-link.active")
    .forEach((navlink) => navlink.classList.remove("active"));
};

const showWallet = () => {
  document.querySelector("#wallet span:first-child").classList.add("d-none");
  document.querySelector("#balance").classList.remove("d-none");
};

const hideWallet = () => {
  document.querySelector("#wallet span:first-child").classList.remove("d-none");
  document.querySelector("#balance").classList.add("d-none");
};

export default { writeToDom, clearActiveNavlinks, showWallet, hideWallet };
