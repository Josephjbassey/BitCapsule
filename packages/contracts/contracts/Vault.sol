// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Vault is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    // Custom errors
    error InvalidTokenAddress();
    error InvalidAmount();
    error InsufficientBalance();
    error VaultLocked();
    error NativeTransferFailed();

    struct Lock {
        uint256 amount;
        uint256 unlockTime;
    }

    // Mapping from token address to user address to UNLOCKED balance
    mapping(address => mapping(address => uint256)) public unlockedBalances;

    // Mapping from token address to user address to an array of LOCKS
    mapping(address => mapping(address => Lock[])) public userLocks;
    
    // Events
    event Deposit(address indexed user, address indexed token, uint256 amount, uint256 unlockTimestamp, string message);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    
    /**
     * @dev Deposit ERC20 tokens or native BTC into the vault
     * @param token The address of the token (address(0) for native BTC)
     * @param amount The amount of tokens to deposit
     */
    function deposit(address token, uint256 amount) external payable nonReentrant {
        // Deposit without lock adds to unlockedBalances
        if (amount == 0) revert InvalidAmount();

        if (token == address(0)) {
            if (msg.value != amount) revert InvalidAmount();
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        unlockedBalances[token][msg.sender] += amount;
        emit Deposit(msg.sender, token, amount, 0, "");
    }

    /**
     * @dev Deposit ERC20 tokens or native BTC into the vault with a time lock
     * @param token The address of the token (address(0) for native BTC)
     * @param amount The amount of tokens to deposit
     * @param lockDuration The duration in seconds to lock the funds
     * @param message A message attached to the deposit
     */
    function depositWithLock(address token, uint256 amount, uint256 lockDuration, string memory message) public payable nonReentrant {
        if (amount == 0) revert InvalidAmount();

        if (token == address(0)) {
            if (msg.value != amount) revert InvalidAmount();
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        if (lockDuration > 0) {
            uint256 unlockTime = block.timestamp + lockDuration;
            userLocks[token][msg.sender].push(Lock({
                amount: amount,
                unlockTime: unlockTime
            }));
            emit Deposit(msg.sender, token, amount, unlockTime, message);
        } else {
            unlockedBalances[token][msg.sender] += amount;
            emit Deposit(msg.sender, token, amount, 0, message);
        }
    }
    
    /**
     * @dev Withdraw ERC20 tokens or native BTC from the vault
     * @param token The address of the token (address(0) for native BTC)
     * @param amount The amount of tokens to withdraw
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        if (amount == 0) revert InvalidAmount();
        
        // Clean up matured locks and add to unlocked balance
        _syncMaturedLocks(token, msg.sender);

        if (unlockedBalances[token][msg.sender] < amount) revert InsufficientBalance();

        unlockedBalances[token][msg.sender] -= amount;

        if (token == address(0)) {
            (bool success, ) = msg.sender.call{value: amount}("");
            if (!success) revert NativeTransferFailed();
        } else {
            IERC20(token).safeTransfer(msg.sender, amount);
        }
        
        emit Withdraw(msg.sender, token, amount);
    }
    
    /**
     * @dev Synchronizes matured locks into the unlocked balance
     */
    function _syncMaturedLocks(address token, address user) internal {
        Lock[] storage locks = userLocks[token][user];
        uint256 i = 0;
        while (i < locks.length) {
            if (block.timestamp >= locks[i].unlockTime) {
                unlockedBalances[token][user] += locks[i].amount;
                // Move the last element to the current position and pop
                locks[i] = locks[locks.length - 1];
                locks.pop();
            } else {
                i++;
            }
        }
    }

    /**
     * @dev Get the TOTAL balance of a user for a specific token (locked + unlocked)
     * @param token The address of the token
     * @param user The address of the user
     * @return The balance of the user for the specified token
     */
    function getBalance(address token, address user) external view returns (uint256) {
        uint256 totalLocked = 0;
        Lock[] memory locks = userLocks[token][user];
        for (uint256 i = 0; i < locks.length; i++) {
            totalLocked += locks[i].amount;
        }
        return unlockedBalances[token][user] + totalLocked;
    }

    /**
     * @dev Returns all locks for a specific user and token
     */
    function getUserLocks(address token, address user) external view returns (Lock[] memory) {
        return userLocks[token][user];
    }

    receive() external payable {}
}
