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
    mapping(address => uint256) public lastPing;
    address public treasury;

    event CapsuleCreated(
        uint256 indexed id,
        address indexed owner,
        address indexed beneficiary,
        uint256 unlockTime,
        VaultType vaultType,
        uint256 amount,
        address token,
        string message
    );
    event CapsuleClaimed(uint256 indexed id, address indexed claimant);
    event EarlyWithdrawal(uint256 indexed id, address indexed owner, uint256 userAmount, uint256 treasuryAmount, address token);
    event Pinged(address indexed user, uint256 timestamp);
    event BeneficiaryUpdated(uint256 indexed id, address indexed oldBeneficiary, address indexed newBeneficiary);
    event CapsuleTransferred(uint256 indexed id, address indexed oldOwner, address indexed newOwner);

    constructor(address _treasury) {
        treasury = _treasury;
    }

    /**
     * @dev Create a new time-locked capsule.
     */
    function createCapsule(
        address token,
        uint256 amount,
        uint256 unlockTimestamp,
        address beneficiary,
        VaultType vaultType,
        string memory message
    ) external payable nonReentrant {
        _createCapsule(msg.sender, token, amount, unlockTimestamp, beneficiary, vaultType, message);
    }

    /**
     * @dev Create a new time-locked capsule for a specific owner (useful for bridge calls).
     */
    function createCapsuleFor(
        address owner,
        address token,
        uint256 amount,
        uint256 unlockTimestamp,
        address beneficiary,
        VaultType vaultType,
        string memory message
    ) external payable nonReentrant {
        _createCapsule(owner, token, amount, unlockTimestamp, beneficiary, vaultType, message);
    }

    function _createCapsule(
        address owner,
        address token,
        uint256 amount,
        uint256 unlockTimestamp,
        address beneficiary,
        VaultType vaultType,
        string memory message
    ) internal {
        require(unlockTimestamp > block.timestamp, "Unlock time must be in the future");

        if (token == address(0)) {
            // Use msg.value as the amount to handle bridge fees or mismatches gracefully
            amount = msg.value;
        } else {
            IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        }

        require(amount > 0, "Amount must be greater than 0");

        // Removed strict beneficiary check to support BTC addresses in metadata with address(0) on-chain

        capsules[capsuleCount] = Capsule({
            owner: owner,
            token: token,
            amount: amount,
            unlockTimestamp: unlockTimestamp,
            beneficiary: beneficiary,
            vaultType: vaultType,
            claimed: false,
            message: message
        });

        lastPing[owner] = block.timestamp;

        emit CapsuleCreated(capsuleCount, owner, beneficiary, unlockTimestamp, vaultType, amount, token, message);
        capsuleCount++;
    }

    function transferCapsule(uint256 id, address newOwner) external nonReentrant {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(msg.sender == capsule.owner, "Only owner");
        require(!capsule.claimed, "Already claimed");
        require(newOwner != address(0), "Invalid new owner");

        address oldOwner = capsule.owner;
        capsule.owner = newOwner;

        // If new owner is not already active, initialize their ping
        if (lastPing[newOwner] == 0) {
            lastPing[newOwner] = block.timestamp;
        }

        emit CapsuleTransferred(id, oldOwner, newOwner);
    }

    function transferBeneficiary(uint256 id, address newBeneficiary) external nonReentrant {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(msg.sender == capsule.owner, "Only owner");
        require(!capsule.claimed, "Already claimed");

        address oldBeneficiary = capsule.beneficiary;
        capsule.beneficiary = newBeneficiary;

        emit BeneficiaryUpdated(id, oldBeneficiary, newBeneficiary);
    }

    function ping() external {
        lastPing[msg.sender] = block.timestamp;
        emit Pinged(msg.sender, block.timestamp);
    }

    function withdrawEarly(uint256 id) external nonReentrant {
        Capsule storage capsule = capsules[id];
        require(capsule.owner != address(0), "Capsule does not exist");
        require(msg.sender == capsule.owner, "Only owner");
        require(!capsule.claimed, "Already claimed");
        require(block.timestamp < capsule.unlockTimestamp, "Unlock time already reached");
        require(capsule.vaultType == VaultType.TEMPORAL || capsule.vaultType == VaultType.HODL, "Early withdrawal N/A");

        capsule.claimed = true;

        uint256 treasuryAmount = (capsule.amount * 20) / 100;
        uint256 userAmount = capsule.amount - treasuryAmount;

        _transfer(capsule.token, treasury, treasuryAmount);
        _transfer(capsule.token, capsule.owner, userAmount);

        emit EarlyWithdrawal(id, msg.sender, userAmount, treasuryAmount, capsule.token);
    }

    function claim(uint256 id) external nonReentrant {
         Capsule storage capsule = capsules[id];
         require(capsule.owner != address(0), "Capsule does not exist");
         require(msg.sender == capsule.owner, "Not owner");
         require(block.timestamp >= capsule.unlockTimestamp, "Not unlocked");
         require(!capsule.claimed, "Already claimed");

         capsule.claimed = true;
         _transfer(capsule.token, capsule.owner, capsule.amount);
         emit CapsuleClaimed(id, msg.sender);
    }

    function claimLegacy(uint256 id) external nonReentrant {
         Capsule storage capsule = capsules[id];
         require(capsule.owner != address(0), "Capsule does not exist");
         require(msg.sender == capsule.beneficiary, "Not beneficiary");
         require(!capsule.claimed, "Already claimed");

         // Dead man switch: 365 days since last ping
         require(block.timestamp >= lastPing[capsule.owner] + 365 days, "Owner still active");

         capsule.claimed = true;
         _transfer(capsule.token, capsule.beneficiary, capsule.amount);
         emit CapsuleClaimed(id, msg.sender);
    }

    function _transfer(address token, address to, uint256 amount) internal {
        if (amount == 0) return;
        if (token == address(0)) {
            (bool success, ) = to.call{value: amount}("");
            require(success, "ETH transfer failed");
        } else {
            IERC20(token).safeTransfer(to, amount);
        }
    }

    receive() external payable {}
}
