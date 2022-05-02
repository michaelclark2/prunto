import utils from "./utils";

const requests = [{ a: "1" }];

const printRequests = () => {
  let htmlString = "<h2>Requests</h2>";
  htmlString += requests
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

export default { printRequests };
