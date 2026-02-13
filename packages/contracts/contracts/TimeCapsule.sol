// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TimeCapsule is ReentrancyGuard {
    using SafeERC20 for IERC20;

    enum VaultType { TEMPORAL, LEGACY, HODL, SOCIAL }

    struct Capsule {
        address owner;
        address beneficiary;
        uint256 unlockTime;
        uint256 amount;
        address token;
        VaultType vaultType;
        bool claimed;
    }

    mapping(uint256 => Capsule) public capsules;
    uint256 public capsuleCount;
    mapping(address => uint256) public lastPing;

    address public treasury;

    event CapsuleCreated(uint256 indexed id, address indexed owner, address indexed beneficiary, uint256 unlockTime, VaultType vaultType, uint256 amount, address token);
    event CapsuleClaimed(uint256 indexed id, address indexed beneficiary, uint256 amount, address token);
    event EarlyWithdrawal(uint256 indexed id, address indexed owner, uint256 userAmount, uint256 treasuryAmount, address token);
    event Pinged(address indexed user, uint256 timestamp);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function createCapsule(
        address beneficiary,
        uint256 unlockTime,
        VaultType vaultType,
        address token,
        uint256 amount
    ) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");

        if (token == address(0)) {
            require(msg.value == amount, "Sent value must match amount");
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        capsules[capsuleCount] = Capsule({
            owner: msg.sender,
            beneficiary: beneficiary,
            unlockTime: unlockTime,
            amount: amount,
            token: token,
            vaultType: vaultType,
            claimed: false
        });

        lastPing[msg.sender] = block.timestamp;

        emit CapsuleCreated(capsuleCount, msg.sender, beneficiary, unlockTime, vaultType, amount, token);
        capsuleCount++;
    }

    function ping() external {
        lastPing[msg.sender] = block.timestamp;
        emit Pinged(msg.sender, block.timestamp);
    }

    function withdrawEarly(uint256 id) external nonReentrant {
        Capsule storage capsule = capsules[id];
        require(msg.sender == capsule.owner, "Only owner can withdraw early");
        require(!capsule.claimed, "Already claimed");
        require(block.timestamp < capsule.unlockTime, "Unlock time already reached");

        capsule.claimed = true;
        uint256 treasuryAmount = (capsule.amount * 20) / 100;
        uint256 userAmount = capsule.amount - treasuryAmount;

        if (capsule.token == address(0)) {
            (bool successTreasury, ) = treasury.call{value: treasuryAmount}("");
            require(successTreasury, "Treasury transfer failed");
            (bool successUser, ) = capsule.owner.call{value: userAmount}("");
            require(successUser, "User transfer failed");
        } else {
            IERC20(capsule.token).safeTransfer(treasury, treasuryAmount);
            IERC20(capsule.token).safeTransfer(capsule.owner, userAmount);
        }

        emit EarlyWithdrawal(id, msg.sender, userAmount, treasuryAmount, capsule.token);
    }

    function claimLegacy(uint256 id) external nonReentrant {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(capsule.vaultType == VaultType.LEGACY, "Not a legacy capsule");
        require(msg.sender == capsule.beneficiary, "Only beneficiary can claim");
        require(!capsule.claimed, "Already claimed");
        require(block.timestamp > lastPing[capsule.owner] + 365 days, "Owner is still active");

        capsule.claimed = true;
        if (capsule.token == address(0)) {
            (bool success, ) = capsule.beneficiary.call{value: capsule.amount}("");
            require(success, "Transfer failed");
        } else {
            IERC20(capsule.token).safeTransfer(capsule.beneficiary, capsule.amount);
        }

        emit CapsuleClaimed(id, msg.sender, capsule.amount, capsule.token);
    }

    function claim(uint256 id) external nonReentrant {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(!capsule.claimed, "Already claimed");
        require(block.timestamp >= capsule.unlockTime, "Unlock time not reached");
        require(msg.sender == capsule.beneficiary || msg.sender == capsule.owner, "Not authorized");

        capsule.claimed = true;
        if (capsule.token == address(0)) {
            (bool success, ) = msg.sender.call{value: capsule.amount}("");
            require(success, "Transfer failed");
        } else {
            IERC20(capsule.token).safeTransfer(msg.sender, capsule.amount);
        }

        emit CapsuleClaimed(id, msg.sender, capsule.amount, capsule.token);
    }
}