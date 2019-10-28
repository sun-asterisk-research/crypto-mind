pragma solidity ^0.5.0;

contract AccessControl {
    address payable public ceoAddress;

    constructor() public {
        ceoAddress = msg.sender;
    }

    modifier onlyCeo() {
        require(msg.sender == ceoAddress, "sender must be ceo");
        _;
    }

    function setCeo(address payable _newCeo) external onlyCeo {
        require(_newCeo != address(0),"New ceo must be different from '0x0'");
        ceoAddress = _newCeo;
    }
}
