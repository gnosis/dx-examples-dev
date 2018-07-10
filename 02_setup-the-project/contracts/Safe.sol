pragma solidity ^0.4.0;

import "@gnosis.pm/util-contracts/contracts/Token.sol";

contract Safe {
    address public owner;
    mapping (address => uint) public balances;
    
    modifier onlyOwner () {
        require(msg.sender == owner);
        _;
    }
    
    function Safe () public {
        owner = msg.sender;
    }
    
    function getBalance (address token) public view returns (uint) {
        return balances[token];
    }
    
    function deposit (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0);
        require(Token(token).transferFrom(msg.sender, this, amount));
        
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