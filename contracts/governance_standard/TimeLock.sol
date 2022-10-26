// SPDX-License-Identifier: MIT

// Want to wait for a new vote to be executed
// Gives time to users to "get out"

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/governance/TimelockController.sol";

contract TimeLock is TimelockController {
    // minDelay: How long you have to wait before executing proposal
    /**
     * @param minDelay How long you have to wait before executing proposal
     * @param proposers the list of addresses that can propose
     * @param executors who can execute a proposal that has passed
     */
    constructor(
        uint256 minDelay,
        address[] memory proposers,
        address[] memory executors
    ) TimelockController(minDelay, proposers, executors) {
        // hi
    }
}
