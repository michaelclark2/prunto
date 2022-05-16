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

    constructor() {
        // add request to contract creator for testing
        requests[msg.sender].push(
            Request(
                payable(0x7a5eDc46915265e1638f7c47c51Cc7cc2a779ab8),
                5000000000000000000,
                "i got five on it",
                false,
                false
            )
        );
    }

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

    function getRequest(uint256 _id)
        public
        view
        returns (
            address,
            uint256,
            string memory,
            bool,
            bool
        )
    {
        Request storage req = requests[msg.sender][_id];
        return (req.requester, req.amount, req.memo, req.accepted, req.denied);
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

    // TODO: validate balances before accepting/paying
    // function makePayment()
    // function clearRequests()
    // function clearLoan()
}
