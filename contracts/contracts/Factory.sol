pragma solidity ^0.5.0;
import "./AccessControl.sol";
import "./Game.sol";

contract Factory is AccessControl {

    address[] public games;

    function createGame()
        public
        onlyCeo
        returns(address)
    {
        address game = address(new Game(msg.sender));
        games.push(game);
        return game;
    }

    function getAllGames() public view returns (address[] memory) {
        return games;
    }

    function() external  {}
}
