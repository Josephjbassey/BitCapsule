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
    error VaultLocked();

    // Mapping from token address to user address to UNLOCKED balance
    mapping(address => mapping(address => uint256)) public unlockedBalances;

    // Mapping from token address to user address to LOCKED balance
    mapping(address => mapping(address => uint256)) public lockedBalances;

    // Mapping from token address to user address to unlock timestamp for the LOCKED balance
    mapping(address => mapping(address => uint256)) public unlockTimestamps;
    
    // Events
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 unlockTimestamp, string message);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    
    /**
     * @dev Deposit ERC20 tokens into the vault
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to deposit
     */
    function deposit(address token, uint256 amount) external {
        // Deposit without lock adds to unlockedBalances
        depositWithLock(token, amount, 0, "");
    }

    /**
     * @dev Deposit ERC20 tokens into the vault with a time lock
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to deposit
     * @param lockDuration The duration in seconds to lock the funds
     * @param message A message attached to the deposit
     */
    function depositWithLock(address token, uint256 amount, uint256 lockDuration, string memory message) public {
        if (token == address(0)) revert InvalidTokenAddress();
        if (amount == 0) revert InvalidAmount();

        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        if (lockDuration > 0) {
            lockedBalances[token][msg.sender] += amount;
            uint256 newUnlockTime = block.timestamp + lockDuration;
            if (newUnlockTime > unlockTimestamps[token][msg.sender]) {
                unlockTimestamps[token][msg.sender] = newUnlockTime;
            }
            emit Deposit(msg.sender, token, amount, unlockTimestamps[token][msg.sender], message);
        } else {
            // No duration provided implies immediate access, treat as unlocked
            unlockedBalances[token][msg.sender] += amount;
            emit Deposit(msg.sender, token, amount, 0, message);
        }
    }
    
    /**
     * @dev Withdraw ERC20 tokens from the vault
     * @param token The address of the ERC20 token
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(address token, uint256 amount) external {
        if (token == address(0)) revert InvalidTokenAddress();
        if (amount == 0) revert InvalidAmount();
        
        uint256 unlocked = unlockedBalances[token][msg.sender];
        uint256 locked = lockedBalances[token][msg.sender];

        if (unlocked + locked < amount) revert InsufficientBalance();

        uint256 remainingToWithdraw = amount;

        // First consume unlocked balances
        if (unlocked >= remainingToWithdraw) {
            unlockedBalances[token][msg.sender] -= remainingToWithdraw;
            remainingToWithdraw = 0;
        } else {
            unlockedBalances[token][msg.sender] = 0;
            remainingToWithdraw -= unlocked;
        }

        // If still need to withdraw, check if locked funds are unlocked
        if (remainingToWithdraw > 0) {
            if (block.timestamp < unlockTimestamps[token][msg.sender]) revert VaultLocked();
            lockedBalances[token][msg.sender] -= remainingToWithdraw;
        }

        IERC20(token).safeTransfer(msg.sender, amount);
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    /**
     * @dev Get the TOTAL balance of a user for a specific token (locked + unlocked)
     * @param token The address of the ERC20 token
     * @param user The address of the user
     * @return The balance of the user for the specified token
     */
    function getBalance(address token, address user) external view returns (uint256) {
        return unlockedBalances[token][user] + lockedBalances[token][user];
    }
}
