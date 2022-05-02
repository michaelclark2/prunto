const writeToDom = (id, htmlString) => {
  document.querySelector(id).innerHTML = htmlString;
};

const clearActiveNavlinks = () => {
  document
    .querySelectorAll(".nav-link.active")
    .forEach((navlink) => navlink.classList.remove("active"));
};

export default { writeToDom, clearActiveNavlinks };
