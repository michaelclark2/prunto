import utils from "./utils";

const loans = [];

const printLoans = () => {
  let htmlString = "<h2>Loans</h2>";
  htmlString += loans
    .map(
      (req) => `
    <div class="card">
        <div class="card-body">
            <h5 class="card-title">Request</h5>
            <p class="card-text">text</p>
        </div>
    </div>
    `
    )
    .join();
  utils.writeToDom("#root", htmlString);
};

export default { printLoans };
