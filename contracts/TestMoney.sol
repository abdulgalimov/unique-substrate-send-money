// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract TestMoney {
    uint public count1;
    uint public count2;

    error ZeroMoney();

    constructor(){

    }

    function test1() public {
        count1 += 1;
    }

    function test2() public payable {
        if (msg.value == 0) {
            revert ZeroMoney();
        }

        count2 += 1;
    }
}
