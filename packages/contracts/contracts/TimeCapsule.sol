// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract TimeCapsule {
    using SafeERC20 for IERC20;

    enum VaultType { TIME_LOCK, SOCIAL, LEGACY }

    struct Capsule {
        address owner;
        address token; // address(0) for ETH
        uint256 amount;
        uint256 unlockTimestamp;
        address beneficiary;
        VaultType vaultType;
        bool claimed;
        string message;
    }

    mapping(uint256 => Capsule) public capsules;
    uint256 public capsuleCount;

    event CapsuleCreated(uint256 indexed id, address indexed owner, address indexed beneficiary, uint256 unlockTime, VaultType vaultType, uint256 amount, address token, string message);
    event CapsuleClaimed(uint256 indexed id, address indexed beneficiary, uint256 amount, address token);
    event EarlyWithdrawal(uint256 indexed id, address indexed owner, uint256 userAmount, uint256 treasuryAmount, address token);
    event Pinged(address indexed user, uint256 timestamp);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    function createCapsule(
        address token,
        uint256 amount,
        uint256 unlockTimestamp,
        address beneficiary,
        VaultType vaultType,
        address token,
        uint256 amount,
        string memory message
    ) external payable nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(unlockTime > block.timestamp, "Unlock time must be in the future");

        if (token == address(0)) {
            require(msg.value == amount, "Sent value must match amount");
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        } else {
            require(amount > 0, "ETH amount must be > 0");
            require(msg.value == amount, "ETH amount mismatch");
        }

        if (vaultType == VaultType.LEGACY || vaultType == VaultType.SOCIAL) {
            require(beneficiary != address(0), "Beneficiary required for LEGACY/SOCIAL vaults");
        }

        if (vaultType == VaultType.LEGACY || vaultType == VaultType.SOCIAL) {
            require(beneficiary != address(0), "Beneficiary required for LEGACY/SOCIAL vaults");
        }

        capsules[capsuleCount] = Capsule({
            owner: msg.sender,
            token: token,
            amount: amount,
            unlockTimestamp: unlockTimestamp,
            beneficiary: beneficiary,
            vaultType: vaultType,
            claimed: false,
            message: message
        });

        lastPing[msg.sender] = block.timestamp;

        emit CapsuleCreated(capsuleCount, msg.sender, beneficiary, unlockTime, vaultType, amount, token, message);
        capsuleCount++;
    }

    function ping() external {
        lastPing[msg.sender] = block.timestamp;
        emit Pinged(msg.sender, block.timestamp);
    }

    function withdrawEarly(uint256 id) external {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(msg.sender == capsule.owner, "Only owner can withdraw early");
        require(!capsule.claimed, "Already claimed");
        require(block.timestamp < capsule.unlockTime, "Unlock time already reached");
        require(capsule.vaultType == VaultType.TEMPORAL || capsule.vaultType == VaultType.HODL, "Early withdrawal only for TEMPORAL/HODL");

        capsule.claimed = true;

        _transfer(capsule.token, capsule.owner, capsule.amount);
        emit CapsuleWithdrawnEarly(id, msg.sender, capsule.amount);
    }

    function claim(uint256 id) external {
         Capsule storage capsule = capsules[id];
         require(capsule.owner != address(0), "Capsule does not exist");
         require(msg.sender == capsule.owner, "Not owner");
         require(block.timestamp >= capsule.unlockTimestamp, "Not unlocked");
         require(!capsule.claimed, "Already claimed");

         capsule.claimed = true;
         _transfer(capsule.token, capsule.owner, capsule.amount);
         emit CapsuleClaimed(id, msg.sender);
    }

    function claimLegacy(uint256 id) external {
         Capsule storage capsule = capsules[id];
         require(capsule.owner != address(0), "Capsule does not exist");
         require(msg.sender == capsule.beneficiary, "Not beneficiary");
         require(block.timestamp >= capsule.unlockTimestamp, "Not unlocked");
         require(!capsule.claimed, "Already claimed");

         capsule.claimed = true;
         _transfer(capsule.token, capsule.beneficiary, capsule.amount);
         emit CapsuleClaimed(id, msg.sender);
    }

    function _transfer(address token, address to, uint256 amount) internal {
        if (token == address(0)) {
            (bool success, ) = to.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }
}
