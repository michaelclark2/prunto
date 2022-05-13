// SPDX-License-Identifier: MIT

pragma solidity >=0.8.0 <0.9.0;

contract Prunto {
    address internal cUsdTokenAddress =
        0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1;
    struct Request {
        address payable requester;
        uint256 amount;
        string memo;
    }
    mapping(address => Request[]) internal requests;

    function sendRequest(
        address _target,
        uint256 _amount,
        string memory _memo
    ) public {
        requests[_target].push(Request(payable(msg.sender), _amount, _memo));
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
            string memory
        )
    {
        Request memory req = requests[msg.sender][_id];
        return (req.requester, req.amount, req.memo);
    }
}
