// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Rate {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    uint256 public MAX_LENGTH = 280;
    Counters.Counter private ratingCounter;

    struct Rating {
        address author;
        string content;
        uint256 timestamp;
        string brokerId;
        string username;
        uint8 rateScore;
    }
    struct brokerRating {
        uint256 brokerRatingCount;
        uint256 brokerTotalScore;
    }
    mapping(address => Rating[]) private ratings;
    mapping(string => Rating[]) private ratingsByBroker;
    mapping(address => mapping(string => Rating)) private userRatings;
    mapping(string => uint256) private brokerRatingCount;
    mapping(string => uint256) private brokerTotalScore;
    address public owner;

    event RatingCreated(Rating);

    constructor(address payable _owner) payable {
        owner = _owner;
    }

    function createRating(
        string memory _content,
        string memory _brokerId,
        string memory username,
        uint8 _rateScore
    ) public payable {
        require(
            bytes(_content).length <= MAX_LENGTH,
            "Content is too long bro!"
        );

        require(_rateScore >= 0 && _rateScore <= 5, "Rate score is invalid!");
        require(
            userRatings[msg.sender][_brokerId].author == address(0),
            "You have already rated this broker!"
        );
        Rating memory newRating = Rating({
            brokerId: _brokerId,
            author: msg.sender,
            content: _content,
            timestamp: block.timestamp,
            rateScore: _rateScore,
            username: username
        });

        userRatings[msg.sender][_brokerId] = newRating;
        ratings[msg.sender].push(newRating);
        ratingsByBroker[newRating.brokerId].push(newRating);
        brokerRatingCount[_brokerId] = brokerRatingCount[_brokerId].add(1);
        brokerTotalScore[_brokerId] = brokerTotalScore[_brokerId].add(
            _rateScore
        );
        emit RatingCreated(newRating);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "YOU ARE NOT THE OWNER!");
        _;
    }

    function initiateContentLengthChange(uint16 newLength) public onlyOwner {
        MAX_LENGTH = newLength;
    }

    function getRating(uint256 _i) public view returns (Rating memory) {
        return ratings[msg.sender][_i];
    }

    function getAllRatingsByOwner(
        address _owner
    ) public view returns (Rating[] memory) {
        return ratings[_owner];
    }

    function getAllRatingsByBroker(
        string memory _brokerId,
        uint256 _limit,
        uint256 _offset
    ) public view returns (Rating[] memory) {
        uint256 index = 0;
        uint256 actualLimit = _limit < ratingsByBroker[_brokerId].length
            ? _limit
            : ratingsByBroker[_brokerId].length;
        Rating[] memory result = new Rating[](actualLimit);
        for (uint256 i = _offset; i < actualLimit; i++) {
            result[index] = ratingsByBroker[_brokerId][i];
            index++;
        }
        return result;
    }

    function getAverageRating(
        string memory _brokerId
    ) public view returns (brokerRating memory) {
        uint256 ratingCount = brokerRatingCount[_brokerId];
        brokerRating memory result;
        if (ratingCount == 0) {
            return result;
        }

        result.brokerRatingCount = ratingCount;
        result.brokerTotalScore = brokerTotalScore[_brokerId];

        if (ratingCount > 0) {
            result.brokerTotalScore = brokerTotalScore[_brokerId].div(
                ratingCount
            );
        }

        return result;
    }
}
