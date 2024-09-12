// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GroupPayment is ReentrancyGuard {
    address public platformOwner; // Địa chỉ ví của nền tảng
    uint256 public platformFeePercent = 5; // Phí nền tảng 5%
    uint256 public groupFeePercent = 95; // Phí nhóm 95%

    struct Group {
        address owner;
        uint256 fee;
        uint256 collectedFees;
        uint256 platformFee;
    }

    mapping(string => Group) public groups;
    mapping(address => Group[]) private groupsOwner;

    string[] private groupIds;

    event GroupCreated(string groupId, address owner, uint256 fee);
    event PaymentMade(string groupId, address member, uint256 amount);
    event Withdrawal(string groupId, uint256 amount);
    event PlatformWithdrawal(uint256 amount);
    event collectedWithdrawal(uint256 amount, address broker);

    constructor(address payable _owner) payable {
        platformOwner = _owner;
    }

    modifier onlyOwner() {
        require(msg.sender == platformOwner, "YOU ARE NOT THE OWNER!");
        _;
    }

    modifier onlyGroupOwner(string memory groupId) {
        require(
            groups[groupId].owner == msg.sender,
            "You are not the group owner"
        );
        _;
    }

    function createGroup(string memory groupId, uint256 fee) external {
        require(groups[groupId].owner == address(0), "Group already exists");
        groups[groupId] = Group({
            owner: msg.sender,
            fee: fee,
            collectedFees: 0,
            platformFee: 0
        });
        groupIds.push(groupId);
        groupsOwner[msg.sender].push(groups[groupId]);
        emit GroupCreated(groupId, msg.sender, fee);
    }

    function joinGroup(string memory groupId) external payable {
        Group storage group = groups[groupId];
        require(group.owner != address(0), "Group does not exist");
        require(group.fee > 0, "Group fee is not set");
        require(msg.value > 0, "Payment amount must be greater than 0");
        require(msg.value >= group.fee, "Incorrect payment amount");
        require(
            address(msg.sender).balance >= group.fee,
            "Insufficient balance"
        );
        group.platformFee += ((msg.value * 10 ** 17 * platformFeePercent) /
            100);
        group.collectedFees += ((msg.value * 10 ** 17 * groupFeePercent) / 100);
        emit PaymentMade(groupId, msg.sender, group.fee);
    }

    function changeFee(
        uint16 _platformFeePercent,
        uint16 _groupFeePercent
    ) public onlyOwner {
        require(_platformFeePercent + _groupFeePercent == 100, "Invalid fee");
        platformFeePercent = _platformFeePercent;
        groupFeePercent = _groupFeePercent;
    }

    // FE phải chia cho 10**17
    function getCollectedFeeByGroup(
        string memory groupId
    ) external view returns (uint256) {
        return groups[groupId].collectedFees;
    }

    function withdraw(string memory groupId) external onlyGroupOwner(groupId) {
        Group storage group = groups[groupId];
        require(group.collectedFees >= 0, "Amount exceeds available balance");
        payable(group.owner).transfer(group.collectedFees / 10 ** 17);
        emit Withdrawal(groupId, group.collectedFees / 10 ** 17);
        group.collectedFees = 0;
    }

    //thêm hàm rút phí chỉ cho owner rút
    function withdrawAllPlatformFees() external payable onlyOwner {
        uint256 totalPlatformFees = 0;
        // Iterate over all groups to sum up platform fees
        for (uint256 i = 0; i < groupIds.length; i++) {
            Group storage group = groups[groupIds[i]];
            totalPlatformFees += group.platformFee;
            group.platformFee = 0; // Reset the fee to prevent re-withdrawing
        }

        // Check if there are any fees to withdraw
        require(totalPlatformFees > 0, "No platform fees available");
        require(
            address(this).balance * 10 ** 17 >= totalPlatformFees,
            "Insufficient contract balance"
        );

        // Transfer the total platform fees to the platform owner
        payable(platformOwner).transfer(totalPlatformFees / 10 ** 17);
        emit PlatformWithdrawal(totalPlatformFees / 10 ** 17);
    }

    function withdrawAllByBroker() external payable {
        uint256 totalcollectedFees = 0;
        for (uint256 i = 0; i < groupIds.length; i++) {
            Group storage group = groups[groupIds[i]];
            if (group.owner == msg.sender) {
                totalcollectedFees += group.collectedFees;
                group.collectedFees = 0;
            }
        }
        require(totalcollectedFees > 0, "No collected fees available");
        require(
            address(this).balance * 10 ** 17 >= totalcollectedFees,
            "Insufficient contract balance"
        );

        // Transfer the total collected fees to the owner group
        payable(msg.sender).transfer(totalcollectedFees / 10 ** 17);
        emit collectedWithdrawal(totalcollectedFees / 10 ** 17, msg.sender);
    }
}
