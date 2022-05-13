// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Prunto {
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
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
        // interest_rate
        // term_length
        // start_timestamp
    }

    mapping(address => Request[]) internal requests;
    mapping(address => Loan) internal loans;

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

    function acceptRequest(uint256 _id) public {
        Request storage req = requests[msg.sender][_id];
        require(!req.accepted, "Request is already accepted.");
        require(!req.denied, "Request is already denied.");
        // todo actually pay requestor
        loans[req.requester] = Loan(payable(msg.sender), req.amount);
        req.accepted = true;
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

    //todo makepayment
}
