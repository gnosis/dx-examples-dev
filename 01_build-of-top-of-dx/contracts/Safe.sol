pragma solidity ^0.4.0;

import "@gnosis.pm/util-contracts/contracts/Token.sol";
import "@gnosis.pm/dx-contracts/contracts/DutchExchange.sol";

contract Safe {
    address public owner;
    mapping (address => uint) public balances;
    DutchExchange dx;
    
    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }
    
    function Safe (address _dx) public {
        require(address(_dx) != address(0));
        
        owner = msg.sender;
        dx = DutchExchange(_dx);
    }

    function updateDutchExchange (DutchExchange _dx) public {
        dx = _dx;
    }
    
    function deposit (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0);
        require(Token(token).transferFrom(msg.sender, this, amount));
        
        balances[token] += amount;
        // balances[token] = 2e9;
        emit Deposit(token, amount);
    }
    
    function withdraw (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0);
        require(amount <= balances[token]);
        
        emit Withdraw(token, amount);
    } 
    
    event Withdraw(
         address indexed token,
         uint amount
    );
    
    event Deposit(
         address indexed token,
         uint amount
    );
}