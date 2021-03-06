const writeToDom = (id, htmlString) => {
  document.querySelector(id).innerHTML = htmlString;
};

const clearActiveNavlinks = () => {
  document.querySelectorAll(".nav-link.active").forEach((navlink) => navlink.classList.remove("active"));
};

const showWallet = () => {
  document.querySelector("#wallet span:first-child").classList.add("d-none");
  document.querySelector("#balance").classList.remove("d-none");
};

const hideWallet = () => {
  document.querySelector("#wallet span:first-child").classList.remove("d-none");
  document.querySelector("#balance").classList.add("d-none");
};

const truncAddress = (address) => {
  return address.substring(0, 6) + "..." + address.slice(-4);
};

const isEmptyAddress = (address) => address === "0x".padEnd(42, "0");

const notificationOff = () => {
  const alert = document.querySelector(".alert");
  if (alert) {
    alert.style.display = "none";
  }
};

const notificationOn = () => {
  const alert = document.querySelector(".alert");
  if (alert) {
    alert.style.display = "block";
  }
};

export default {
  writeToDom,
  clearActiveNavlinks,
  showWallet,
  hideWallet,
  truncAddress,
  isEmptyAddress,
  notificationOff,
  notificationOn,
};
