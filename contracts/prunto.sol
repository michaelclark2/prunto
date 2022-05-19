// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

contract Prunto {
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    mapping(address => Request[]) internal requests;
    mapping(address => Loan) internal loans;

    struct Request {
        address payable requester;
        uint256 amount;
        string memo;
        bool accepted;
        bool denied;
    }

    struct Loan {
        address payable issuer;
        uint256 amount;
        uint256 balance;
        // interest_rate
        // term_length
        // start_timestamp
    }

    function sendRequest(
        address _target,
        uint256 _amount,
        string memory _memo
    ) public {
        requests[_target].push(
            Request(payable(msg.sender), _amount, _memo, false, false)
        );
    }

    function getRequestsLength() public view returns (uint256) {
        return requests[msg.sender].length;
    }

    function getRequest(uint256 _id) public view returns (Request memory) {
        return requests[msg.sender][_id];
    }

    function acceptRequest(uint256 _id) public payable {
        Request storage request = requests[msg.sender][_id];
        require(!request.accepted, "Request is already accepted.");
        require(!request.denied, "Request is already denied.");
        require(
            loans[request.requester].issuer == address(0),
            "Requester currently has an active loan"
        );
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                request.requester,
                request.amount
            ),
            "Transfer failed"
        );

        loans[request.requester] = Loan(
            payable(msg.sender),
            request.amount,
            request.amount
        );
        request.accepted = true;
    }

    function denyRequest(uint256 _id) public {
        Request storage req = requests[msg.sender][_id];
        require(!req.accepted, "Request is already accepted.");
        require(!req.denied, "Request is already denied.");
        req.denied = true;
    }

    function getLoan() public view returns (Loan memory) {
        return loans[msg.sender];
    }

    function makePayment(uint256 _amount) public payable {
        require(loans[msg.sender].issuer != address(0), "No active loan.");

        require(
            loans[msg.sender].balance - _amount >= 0,
            "Amount more than active balance."
        );
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                payable(msg.sender),
                loans[msg.sender].issuer,
                _amount
            ),
            "Transfer failed"
        );
        loans[msg.sender].balance -= _amount;

        if (loans[msg.sender].balance == 0) {
            delete loans[msg.sender];
        }
    }

    function payRemainingBalance() public payable {
        require(loans[msg.sender].issuer != address(0), "No active loan.");
        require(loans[msg.sender].balance > 0, "No remaining balance.");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                payable(msg.sender),
                loans[msg.sender].issuer,
                loans[msg.sender].balance
            ),
            "Transfer failed"
        );

        loans[msg.sender].balance = 0;
        delete loans[msg.sender];
    }

    // todo: function clearRequests()
}
