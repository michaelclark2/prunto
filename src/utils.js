const writeToDom = (id, htmlString) => {
  document.querySelector(id).innerHTML = htmlString;
};

export default { writeToDom };
