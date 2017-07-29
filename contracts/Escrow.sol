pragma solidity ^0.4.10; //We have to specify what version of compiler this code will use

contract Escrow {
  enum Status {Pending, Purchased, Shipped, Completed, Cancelled, SellerTimeOut, BuyerTimeOut}
  enum Category {Good, Digital, Service, Auction}

  struct Purchase {
    uint amount;
    address seller;
    address buyer;
    Status status;
    bytes32 code;
    bytes32 itemId;
    Category category;
  }

  struct Review {
    uint total;
    uint rating;
    bytes32[] comments;
  }

  address owner;
  mapping(bytes32 => Purchase) public purchases;
  mapping(bytes32 => uint) public itemSales;
  mapping(address => uint) public userSales;
  mapping(address => Review) public userReviews;
  mapping(bytes32 => Review) public itemReviews;

  // uint public shippedTime;
  // uint public cancelTime;
  // uint public purchasedTime;
  // uint public completedTime;
  // uint public timeoutTime;

  event ItemPurchased(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint amount);
  event ItemShipped(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, bytes32 code);
  event PurchaseCompleted(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);
  event PurchaseCancelled(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);

  function Escrow() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  //   modifier onlyBuyer() {
  //   require(msg.sender == buyer);
  //   _;
  // }

  // modifier onlySeller() {
  //   require(msg.sender == seller);
  //   _;
  // }

  // Buyer Purchase an item '_itemId' from Seller (_seller)
  // State of the purchase : "Purchased"
  function purchase(bytes32 _purchaseId, address _seller, bytes32 _itemId) payable {
    purchases[_purchaseId].itemId = _itemId;
    purchases[_purchaseId].seller = _seller;
    purchases[_purchaseId].buyer = msg.sender;
    purchases[_purchaseId].status = Status.Purchased;
    purchases[_purchaseId].amount = msg.value;
    ItemPurchased(_purchaseId, msg.sender, _seller, _itemId, msg.value);
  }

  // Seller send the code to Buyer
  // Code can be a tracking number, a digital code, a coupon
  // State of the purchase : "Shipped"
  function setCode(bytes32 _purchaseId, bytes32 _code) {
    purchases[_purchaseId].code = _code;
    purchases[_purchaseId].status = Status.Shipped;
    ItemShipped(_purchaseId, purchases[_purchaseId].buyer, msg.sender, purchases[_purchaseId].itemId, _code);
  }

  // Buyer confirms receive the code from the Seller - Completing the transactions
  // Seller receives the money
  // State of the purchase : "Completed"
  function confirmPurchase(bytes32 _purchaseId, bytes32 _userReviewId, bytes32 _itemReviewId, uint _userRating, uint _itemRating) {
    if (purchases[_purchaseId].seller.send(purchases[_purchaseId].amount)) {
      purchases[_purchaseId].amount = 0;
      purchases[_purchaseId].status = Status.Completed;
      PurchaseCompleted(_purchaseId, msg.sender, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
      // Set item's review & rating + total number of item sales
      itemSales[purchases[_purchaseId].itemId] += 1;
      setReview(false, _purchaseId, _itemReviewId, _itemRating);

      // Set user's review & rating + total number of sales
      userSales[purchases[_purchaseId].seller] += 1;
      setReview(true, _purchaseId, _userReviewId, _userRating);
    }
  }

  // Set Item or Users's review & rating
  function setReview(bool isUserReview, bytes32 _purchaseId, bytes32 _reviewId, uint _rating) internal {
    Review review;
    if (isUserReview) {
      review = userReviews[purchases[_purchaseId].seller];
    } else {
      review = itemReviews[purchases[_purchaseId].itemId];
    }

    // No rating was provided
    if (_rating != 0) {
      review.total += 1;
      review.rating += _rating;
    }
    // No review was provided
    if (_reviewId.length != 0) {
      review.comments.push(_reviewId);
    }
  }

  function cancelPurchase(bytes32 _purchaseId) {
    if (purchases[_purchaseId].buyer.send(purchases[_purchaseId].amount)) {
      purchases[_purchaseId].status = Status.Cancelled;
      purchases[_purchaseId].amount = 0;
      PurchaseCancelled(_purchaseId, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
    }
  }

  function getBalance() constant onlyOwner returns (uint) {
    return this.balance;
  }

  // Kill the contract and send all the balance to the owner's wallet
  function killContract() onlyOwner {
    selfdestruct(owner);
  }

  // Get Purchase (_purchaseId) infos
  function getPurchase(bytes32 _purchaseId) constant returns(uint, address, address, Status, bytes32, bytes32) {
    return (purchases[_purchaseId].amount,
            purchases[_purchaseId].seller,
            purchases[_purchaseId].buyer,
            purchases[_purchaseId].status,
            purchases[_purchaseId].code,
            purchases[_purchaseId].itemId);
  }

  // Get seller total number of sales he made
  function getUserSalesNumber(address _user) constant returns (uint) {
    return userSales[_user];
  }

  // Get total number item sold
  function getItemSalesNumber(bytes32 _itemId) constant returns (uint) {
    return itemSales[_itemId];
  }

  function getUserReviews(address _user) constant returns (uint, uint, uint) {
    return (userReviews[_user].total,
            userReviews[_user].rating,
            userReviews[_user].comments.length);
  }

  function getUserReviewComment(address _user, uint _index) constant returns (bytes32) {
    return userReviews[_user].comments[_index];
  }

  function getItemReviews(bytes32 _itemId) constant returns (uint, uint, uint) {
    return (itemReviews[_itemId].total,
            itemReviews[_itemId].rating,
            itemReviews[_itemId].comments.length);
  }

  function getItemReviewComment(bytes32 _itemId, uint _index) constant returns (bytes32) {
    return itemReviews[_itemId].comments[_index];
  }

  // function fee(){
  //     escrow.send(this.balance / 100); //1% fee
  //     payOut();
  // }

}

