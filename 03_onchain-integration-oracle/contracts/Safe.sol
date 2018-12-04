pragma solidity ^0.4.24;

import "@gnosis.pm/util-contracts/contracts/Token.sol";
import "@gnosis.pm/dx-contracts/contracts/DutchExchange.sol";
import "@gnosis.pm/dx-contracts/contracts/Oracle/PriceOracleInterface.sol";

contract Safe {
    address public owner;
    mapping (address => uint) public balances;
    DutchExchange public dx;
    
    modifier onlyOwner () {
        require(msg.sender == owner, "Only the owner can do the operation");
        _;
    }
    
    constructor (address _dx) public {
        require(address(_dx) != address(0), "The DutchX address must be valid");
        
        owner = msg.sender;
        dx = DutchExchange(_dx);
    }

    function updateDutchExchange (DutchExchange _dx) public onlyOwner {
        dx = _dx;
    }
    
    function deposit (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0, "The deposit amount should be greater than 0");
        require(Token(token).transferFrom(msg.sender, this, amount), "The deposit transfer must succeed");
        
        balances[token] += amount;
        emit Deposit(token, amount);

        return amount;
    }
    
    function withdraw (address token, uint amount) public onlyOwner returns (uint) {
        require(amount > 0, "The withdraw amount should be greater than 0");
        require(amount <= balances[token], "There should be enough balance for the token");
        require(Token(token).transfer(msg.sender, amount), "The withdraw transfer must succeed");
        
        balances[token] -= amount;
        emit Withdraw(token, amount);

        return amount;
    }

    function getBalanceInUsd (address token) public view returns (uint, uint) {
        uint pricetNum;
        uint priceDen;
        // Get the price in ETH for a token
        (pricetNum, priceDen) = dx.getPriceOfTokenInLastAuction(token);

        // Get the price of ETH
        PriceOracleInterface priceOracle = PriceOracleInterface(dx.ethUSDOracle());
        uint etherUsdPrice = priceOracle.getUSDETHPrice();
        // uint etherUsdPrice = 400 ether;

        // Return the price in USD:
        //    balance * Price TOKEN-ETH * price ETH-USD
        uint balance = balances[token];
        return (balance * pricetNum * etherUsdPrice, priceDen);
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