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

    event CapsuleCreated(uint256 indexed id, address indexed owner, uint256 unlockTimestamp, string message);
    event CapsuleClaimed(uint256 indexed id, address indexed claimant);
    event CapsuleWithdrawnEarly(uint256 indexed id, address indexed owner, uint256 amount);

    function createCapsule(
        address token,
        uint256 amount,
        uint256 unlockTimestamp,
        address beneficiary,
        VaultType vaultType,
        string memory message
    ) external payable {
        // Enforce future unlock time to prevent immediate claiming
        require(unlockTimestamp > block.timestamp, "Unlock must be in future");

        if (token != address(0)) {
            require(msg.value == 0, "Do not send ETH for ERC20 capsule");
            require(amount > 0, "Amount must be > 0");
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        } else {
            require(amount > 0, "ETH amount must be > 0");
            require(msg.value == amount, "ETH amount mismatch");
        }

        if (vaultType == VaultType.LEGACY || vaultType == VaultType.SOCIAL) {
            require(beneficiary != address(0), "Beneficiary required for LEGACY/SOCIAL vaults");
        }

        capsuleCount++;
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

        emit CapsuleCreated(capsuleCount, msg.sender, unlockTimestamp, message);
    }

    function withdrawEarly(uint256 id) external {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(msg.sender == capsule.owner, "Not owner");
        require(!capsule.claimed, "Already claimed");

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
