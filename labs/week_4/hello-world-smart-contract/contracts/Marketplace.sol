// contracts/Marketplace.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Marketplace {
    struct Item {
        uint itemId;
        address payable seller;
        string name;
        string description;
        uint price;
        bool sold;
    }

    struct Review {
        address reviewer;
        uint rating;
        string comment;
    }

    mapping(uint => Item) public items;
    mapping(uint => Review[]) public itemReviews;
    uint public itemCount;

    event ItemListed(uint itemId, address seller, uint price);
    event ItemSold(uint itemId, address buyer);
    event ReviewAdded(uint itemId, address reviewer);

    modifier onlySeller(uint _itemId) {
        require(items[_itemId].seller == msg.sender, "Not the seller");
        _;
    }

    modifier itemExists(uint _itemId) {
        require(_itemId > 0 && _itemId <= itemCount, "Item does not exist");
        _;
    }

    function listItem(string memory _name, string memory _description, uint _price) public {
        require(_price > 0, "Price must be greater than zero");
        itemCount++;
        items[itemCount] = Item(itemCount, payable(msg.sender), _name, _description, _price, false);
        emit ItemListed(itemCount, msg.sender, _price);
    }

    function purchaseItem(uint _itemId) public payable itemExists(_itemId) {
        Item storage item = items[_itemId];
        require(msg.value == item.price, "Incorrect value sent");
        require(!item.sold, "Item already sold");
        item.seller.transfer(msg.value);
        item.sold = true;
        emit ItemSold(_itemId, msg.sender);
    }

    function addReview(uint _itemId, uint _rating, string memory _comment) public itemExists(_itemId) {
        require(_rating >= 1 && _rating <= 5, "Rating must be between 1 and 5");
        itemReviews[_itemId].push(Review(msg.sender, _rating, _comment));
        emit ReviewAdded(_itemId, msg.sender);
    }

    function getReviews(uint _itemId) public view itemExists(_itemId) returns (Review[] memory) {
        return itemReviews[_itemId];
    }
}