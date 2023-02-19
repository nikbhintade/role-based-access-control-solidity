// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract RBAC is AccessControl {
    using Counters for Counters.Counter;

    bytes32 public constant CREATOR = keccak256("CREATOR");

    Counters.Counter public count;
    mapping(uint256 => bytes32) public entries;

    constructor() {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function createEntry(bytes32 data) public onlyRole(CREATOR) {
        entries[count.current()] = data;
        count.increment();
    }

    function grantCreatorRole(address _address) public {
        grantRole(CREATOR, _address);
    }

    function revokeCreatorRole(address _address) public {
        revokeRole(CREATOR, _address);
    }

    function renounceCreatorRole() public {
        renounceRole(CREATOR, msg.sender);
    }
}
