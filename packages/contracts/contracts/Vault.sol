// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract Vault  {
    using SafeERC20 for IERC20;
    
    // Custom errors
    error InvalidTokenAddress();
    error InvalidAmount();
    error InsufficientBalance();
    
    // Custom errors
    error VaultLocked();

    // Mapping from token address to user address to balance
    mapping(address => mapping(address => uint256)) public balances;
    // Mapping from token address to user address to unlock timestamp
    mapping(address => mapping(address => uint256)) public unlockTimestamps;
    
    // Events
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 unlockTimestamp);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    
    /**
     * @dev Deposit ERC20 tokens into the vault
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to deposit
     */
    function deposit(address token, uint256 amount) external {
        depositWithLock(token, amount, 0);
    }

    /**
     * @dev Deposit ERC20 tokens into the vault with a time lock
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to deposit
     * @param lockDuration The duration in seconds to lock the funds
     */
    function depositWithLock(address token, uint256 amount, uint256 lockDuration) public {
        if (token == address(0)) revert InvalidTokenAddress();
        if (amount == 0) revert InvalidAmount();
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        balances[token][msg.sender] += amount;
        
        if (lockDuration > 0) {
            uint256 newUnlockTime = block.timestamp + lockDuration;
            if (newUnlockTime > unlockTimestamps[token][msg.sender]) {
                unlockTimestamps[token][msg.sender] = newUnlockTime;
            }
        }

        emit Deposit(msg.sender, token, amount, unlockTimestamps[token][msg.sender]);
    }
    
    /**
     * @dev Withdraw ERC20 tokens from the vault
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(address token, uint256 amount) external {
        if (token == address(0)) revert InvalidTokenAddress();
        if (amount == 0) revert InvalidAmount();
        if (balances[token][msg.sender] < amount) revert InsufficientBalance();
        if (block.timestamp < unlockTimestamps[token][msg.sender]) revert VaultLocked();
        
        balances[token][msg.sender] -= amount;
        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    /**
     * @dev Get the balance of a user for a specific token
     * @param token The address of the ERC20 token
     * @param user The address of the user
     * @return The balance of the user for the specified token
     */
    function getBalance(address token, address user) external view returns (uint256) {
        return balances[token][user];
    }
}