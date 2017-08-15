pragma solidity ^0.4.10; //We have to specify what version of compiler this code will use

contract Escrow {
  enum Status {Pending, Purchased, Shipped, Completed, BuyerCancelled, SellerCancelled, SellerShippingTimeOut, BuyerConfirmationTimeOut}
  enum Category {Good, Digital, Service, Auction}

  struct Purchase {
    uint amount;
    address seller;
    address buyer;
    Status status;
    bytes32 code;
    bytes32 itemId;
    Category category;
    uint shippingDaysDeadline;
    uint purchasedTime;
    uint shippedTime;
    // uint cancelTime;
    // uint completedTime;
    // uint timeoutTime;
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
  bytes32[] pendingPurchases;
  uint public confirmationDaysDeadline;

  event ItemPurchased(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint amount);
  event ItemShipped(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, bytes32 code);
  event PurchaseCompleted(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);
  event PurchaseCancelled(bytes32 purchaseId, address sender, address buyer, address seller, bytes32 itemId);
  event ShippingTimeout(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);
  event ConfirmationTimeout(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);

  function Escrow() {
    owner = msg.sender;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  // modifier onlyBuyer(buyer) {
  //   require(msg.sender == buyer);
  //   _;
  // }

  // modifier onlySeller(seller) {
  //   require(msg.sender == seller);
  //   _;
  // }

  // Buyer Purchase an item '_itemId' from Seller (_seller)
  // State of the purchase : "Purchased"
  function purchase(bytes32 _purchaseId, address _seller, bytes32 _itemId, uint _shippingDaysDeadline) payable {
    purchases[_purchaseId].itemId = _itemId;
    purchases[_purchaseId].seller = _seller;
    purchases[_purchaseId].buyer = msg.sender;
    purchases[_purchaseId].status = Status.Purchased;
    purchases[_purchaseId].amount = msg.value;
    purchases[_purchaseId].purchasedTime = now;
    purchases[_purchaseId].shippingDaysDeadline = now + _shippingDaysDeadline * 1 minutes;
    pendingPurchases.push(_purchaseId);
    ItemPurchased(_purchaseId, msg.sender, _seller, _itemId, msg.value);
  }

  // Seller send the code to Buyer
  // Code can be a tracking number, a digital code, a coupon
  // State of the purchase : "Shipped"
  function setCode(bytes32 _purchaseId, bytes32 _code) {
    purchases[_purchaseId].code = _code;
    purchases[_purchaseId].status = Status.Shipped;
    purchases[_purchaseId].shippedTime = now;
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
      deletePurchaseFromPending(IndexOf(_purchaseId));
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

  // Cancel a Purchase
  // ---> can only happen before the item has been shipped
  // If sender == buyer : State of the purchase : "BuyerCancelled"
  // If sender == buyer : State of the purchase : "SellerCancelled"
  function cancelPurchase(bytes32 _purchaseId) {
    if (purchases[_purchaseId].buyer.send(purchases[_purchaseId].amount)) {
      if (purchases[_purchaseId].buyer == msg.sender) {
          purchases[_purchaseId].status = Status.BuyerCancelled;
        } else {
          purchases[_purchaseId].status = Status.SellerCancelled;
        }

      purchases[_purchaseId].amount = 0;
      deletePurchaseFromPending(IndexOf(_purchaseId));
      PurchaseCancelled(_purchaseId, msg.sender, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
    }
  }

  // Get total balance of the Escrow contract
  function getBalance() constant onlyOwner returns (uint) {
    return this.balance;
  }

  // Kill the contract and send all the balance to the owner's wallet
  function killContract() onlyOwner {
    selfdestruct(owner);
  }


  // Get Shipping Date Deadline for a purchase
  function getPurchaseTimes(bytes32 _purchaseId) constant returns (uint, uint) {
    return (purchases[_purchaseId].shippingDaysDeadline, purchases[_purchaseId].purchasedTime);
  }

  // Get current state of a purchase
  function getPurchaseState(bytes32 _purchaseId) constant returns (Status) {
    return purchases[_purchaseId].status;
  }

  // Get seller total number of sales he made
  function getUserSalesNumber(address _user) constant returns (uint) {
    return userSales[_user];
  }

  // Get total number item sold
  function getItemSalesNumber(bytes32 _itemId) constant returns (uint) {
    return itemSales[_itemId];
  }

  // Get a seller total number of rating
  //     -- and the accumulated rating score
  //     -- and the total number of reviews left
  function getUserReviews(address _user) constant returns (uint, uint, uint) {
    return (userReviews[_user].total,
            userReviews[_user].rating,
            userReviews[_user].comments.length);
  }

  // Get one user review ID
  function getUserReviewComment(address _user, uint _index) constant returns (bytes32) {
    return userReviews[_user].comments[_index];
  }

  // Get an item total number of rating
  //     -- and the accumulated rating score
  //     -- and the total number of reviews left
  function getItemReviews(bytes32 _itemId) constant returns (uint, uint, uint) {
    return (itemReviews[_itemId].total,
            itemReviews[_itemId].rating,
            itemReviews[_itemId].comments.length);
  }

  // Get one item review ID
  function getItemReviewComment(bytes32 _itemId, uint _index) constant returns (bytes32) {
    return itemReviews[_itemId].comments[_index];
  }

  // Delete a purchase from the list of pending purchases
  // i.e : when a purchase is complete or cancel
  function deletePurchaseFromPending(uint index) {
    // Index == -1 means that the item doesn't exist in the array
    require((index !=  uint(-1)) && (index < pendingPurchases.length));

    delete pendingPurchases[index];
    if (pendingPurchases.length >= 2) {
      pendingPurchases[index] = pendingPurchases[pendingPurchases.length - 1];
      delete pendingPurchases[pendingPurchases.length - 1];
    }
    pendingPurchases.length--;
  }

   /** Finds the index of a given value in an array. */
  function IndexOf(bytes32 _purchaseId) constant returns(uint) {
    for (uint i = 0; i < pendingPurchases.length; i++) {
      if (pendingPurchases[i] == _purchaseId) {
        return i;
      }
    }
    // Index not found
    return uint(-1);
  }

  // Main auto cancel function
  //   -- cancel shipping Timeout orders
  //   -- cancel confirmation timeout orders
  function cancelTimeoutOrders() {
    bytes32[] pendingPurchasesToDelete;

    for (uint i = 0; i < pendingPurchases.length; i++) {
      // Automatically cancel orders that haven't been shipped before the deadline
      if (cancelShippingTimeoutOrders(pendingPurchases[i])) {
        pendingPurchasesToDelete.push(pendingPurchases[i]);
      }
    }

    ItemPurchased(pendingPurchases[0], msg.sender, msg.sender, pendingPurchases[0], pendingPurchasesToDelete.length);
    ItemPurchased(pendingPurchasesToDelete[0], msg.sender, msg.sender, pendingPurchasesToDelete[0], IndexOf(pendingPurchasesToDelete[0]));

    // for (uint j = 0; j < tmpPendingPurchases.length; j++) {
    //   deletePurchaseFromPending(IndexOf(tmpPendingPurchases[j]));
    // }
  }

  // Automatically cancel orders that haven't been shipped before the deadline
  function cancelShippingTimeoutOrders(bytes32 _purchaseId) returns(bool) {
    if ((purchases[_purchaseId].shippingDaysDeadline <  now) && (purchases[_purchaseId].status == Status.Purchased)) {
      if (purchases[_purchaseId].buyer.send(purchases[_purchaseId].amount)) {
        purchases[_purchaseId].status = Status.SellerShippingTimeOut;
        purchases[_purchaseId].amount = 0;
        ShippingTimeout(_purchaseId, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
        return true;
      }
    }
    return false;
  }

  function cancelConfirmationTimeoutOrders(bytes32 purchaseId) {
    // Automatically confirm orders that haven't been confirmed by the users before the deadline
      // if (((purchases[pendingPurchases[i]].shippedTime + confirmationDaysDeadline * 1.days) <  now)
      //     && (purchases[pendingPurchases[i]].status == Status.Shipped)) {
      //   if (purchases[pendingPurchases[i]].seller.send(purchases[pendingPurchases[i]].amount)) {
      //     purchases[pendingPurchases[i]].status = Status.BuyerConfirmationTimeOut;
      //     purchases[pendingPurchases[i]].amount = 0;
      //     deletePurchaseFromPending(i);
      //     ConfirmationTimeout(pendingPurchases[i], purchases[pendingPurchases[i]].buyer, purchases[pendingPurchases[i]].seller, purchases[pendingPurchases[i]].itemId);
      //   }
      // }
  }

  function setConfirmationDaysDeadline(uint _day) {
    confirmationDaysDeadline = _day;
  }

  function getOnePendingPurchase(uint _index) constant returns(bytes32, uint) {
    return (pendingPurchases[_index],
            pendingPurchases.length);
  }

  // function fee(){
  //     escrow.send(this.balance / 100); //1% fee
  //     payOut();
  // }

}

