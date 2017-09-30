pragma solidity ^0.4.15; //We have to specify what version of compiler this code will use

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
    uint cancelTime;
    uint completedTime;
    uint timeoutTime;
  }

  struct Review {
    uint total;
    uint rating;
    bytes32[] comments;
  }

  struct User {
    address wallet;
    Review review;
    uint salesNumber;
    uint balance;
  }

  struct Item {
    bytes32 itemId;
    Review review;
    uint salesNumber;
  }

  address owner;
  mapping(bytes32 => Purchase) public purchases;
  // mapping(bytes32 => uint) public itemSales;
  // mapping(bytes32 => Review) public itemReviews;
  // mapping(address => uint) public userSales;
  // mapping(address => Review) public userReviews;
  mapping(address => User) public sellers;
  mapping(bytes32 => Item) public items;

  bytes32[] private pendingPurchases;
  bytes32[] private pendingPurchasesToDelete;
  uint private numPendingPurchasesToDelete = 0;
  uint public confirmationDaysDeadline = 15;

  event ItemPurchased(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint amount);
  event ItemShipped(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, bytes32 code);
  event PurchaseCompleted(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);
  event PurchaseCancelled(bytes32 purchaseId, address sender, address buyer, address seller, bytes32 itemId);
  event ShippingTimeout(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);
  event ConfirmationTimeout(bytes32 purchaseId, address buyer, address seller, bytes32 itemId);

  function Escrow() {
    owner = msg.sender;
  }


  /**
   * Guarantee that the sender is the creator of the contract (the one who deployed it)
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * Guarantee that the sender is the buyer of the purchase
   * param  {address}
   * return {}
   */
  modifier onlyBuyer(address _buyer) {
    require(msg.sender == _buyer);
    _;
  }

  /**
   * Guarantee that the sender is the Seller of the purchase
   * param  {address}
   * return {}
   */
  modifier onlySeller(address _seller) {
    require(msg.sender == _seller);
    _;
  }

  /**
   * Guarantee that the sender is either a buyer or seller of his transaction
   * params {address}
   * params {address}
   */
  modifier onlyBuyerOrSeller(address _buyer, address _seller) {
    require(msg.sender == _buyer || msg.sender == _seller);
    _;
  }

  /**
   * Prevent a buyer from buying an item he listed himself
   * params {address} _buyer
   * params {address} _seller
   */
  modifier preventSelfBuy(address _buyer, address _seller) {
    require(_buyer != _seller);
    _;
  }

  /**
   * Require that current state of purchase "_purchaseState" is equal to "_tmpState"
   * params {Purchase} _purchase: current purchase
   * params {Status} _requirePurchaseState: purchase status we want the purchase to be equal to
   */
  modifier onlyForPurchaseState(Purchase _purchase, Status _requirePurchaseState) {
    require(_purchase.status == _requirePurchaseState);
    _;
  }

  /**
   * Buyer Purchase an item '_itemId' from Seller (_seller) - State of the purchase : "Purchased"
   *  params {bytes32} ID of _purchase
   *  params {address} wallet address of _seller
   *  params {bytes32} ID of _item
   *  params {uint} seller needs to ship the item within _shippingDaysDeadline days after purchase or purchase will be timeout and cancelled
   */
  function purchase(bytes32 _purchaseId, address _seller, bytes32 _itemId, uint _shippingDaysDeadline)
  preventSelfBuy(msg.sender, _seller)
  payable public
  {
    purchases[_purchaseId].itemId = _itemId;
    purchases[_purchaseId].seller = _seller;
    purchases[_purchaseId].buyer = msg.sender;
    purchases[_purchaseId].status = Status.Purchased;
    purchases[_purchaseId].amount = msg.value;
    purchases[_purchaseId].purchasedTime = now;
    purchases[_purchaseId].shippingDaysDeadline = now + _shippingDaysDeadline * 1 days;
    pendingPurchases.push(_purchaseId);
    ItemPurchased(_purchaseId, msg.sender, _seller, _itemId, msg.value);
  }

  /**
   * Seller send the code to Buyer (Code can be a tracking number, a digital code, a coupon) [ State of the purchase : "Shipped"]
   * params {bytes32 _purchaseId}
   * params {bytes32 _code}
   * return {Event Log ItemShipped}
   */
  function setCode(bytes32 _purchaseId, bytes32 _code)
  onlySeller(purchases[_purchaseId].seller)
  public
  {
    purchases[_purchaseId].code = _code;
    purchases[_purchaseId].status = Status.Shipped;
    purchases[_purchaseId].shippedTime = now;
    ItemShipped(_purchaseId, purchases[_purchaseId].buyer, msg.sender, purchases[_purchaseId].itemId, _code);
  }

  // Buyer confirms receive the code from the Seller - Completing the transactions
  // Seller receives the money
  // State of the purchase : "Completed"
  function confirmPurchase(bytes32 _purchaseId, bytes32 _userReviewId, bytes32 _itemReviewId, uint _userRating, uint _itemRating)
  onlyBuyer(purchases[_purchaseId].buyer)
  public
  {
    if (purchases[_purchaseId].seller.send(purchases[_purchaseId].amount)) {
      purchases[_purchaseId].amount = 0;
      purchases[_purchaseId].status = Status.Completed;
      // Set item's review & rating + total number of item sales
      itemSales[purchases[_purchaseId].itemId] += 1;
      setReview(false, _purchaseId, _itemReviewId, _itemRating);

      // Set user's review & rating + total number of sales
      userSales[purchases[_purchaseId].seller] += 1;
      setReview(true, _purchaseId, _userReviewId, _userRating);
      deleteOnePurchaseFromPending(IndexOfPurchase(_purchaseId));
      purchases[_purchaseId].completedTime = now;
      PurchaseCompleted(_purchaseId, msg.sender, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
    }
  }

  // Set Item or Users's review & rating
  function setReview(bool isUserReview, bytes32 _purchaseId, bytes32 _reviewId, uint _rating) private {
    Review review;
    if (isUserReview) {
      review = userReviews[purchases[_purchaseId].seller];
    } else {
      review = itemReviews[purchases[_purchaseId].itemId];
    }

    // Test if rating was provided
    if (_rating != 0) {
      review.total += 1;
      review.rating += _rating;
    }
    // Test if review was provided
    if (_reviewId.length != 0) {
      review.comments.push(_reviewId);
    }
  }

  // Cancel a Purchase
  // ---> can only happen before the item has been shipped
  // If sender == buyer : State of the purchase : "BuyerCancelled"
  // If sender == buyer : State of the purchase : "SellerCancelled"
  function cancelPurchase(bytes32 _purchaseId)
  onlyForPurchaseState(purchases[_purchaseId], Status.Purchased)
  onlyBuyerOrSeller(purchases[_purchaseId].buyer, purchases[_purchaseId].seller)
  public
  {
    if (purchases[_purchaseId].buyer.send(purchases[_purchaseId].amount)) {
      if (purchases[_purchaseId].buyer == msg.sender) {
          purchases[_purchaseId].status = Status.BuyerCancelled;
        } else {
          purchases[_purchaseId].status = Status.SellerCancelled;
        }

      purchases[_purchaseId].amount = 0;
      purchases[_purchaseId].cancelTime = now;
      deleteOnePurchaseFromPending(IndexOfPurchase(_purchaseId));
      PurchaseCancelled(_purchaseId, msg.sender, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
    }
  }

  // Get total balance of the Escrow contract
  function getBalance() onlyOwner constant public returns (uint) {
    return this.balance;
  }

  // Kill the contract and send all the balance to the owner's wallet
  function killContract() onlyOwner public {
    selfdestruct(owner);
  }

  // Get Shipping Date Deadline for a purchase
  function getPurchaseTimes(bytes32 _purchaseId) constant public returns (uint, uint, uint, uint, uint, uint) {
    return (purchases[_purchaseId].shippingDaysDeadline,
            purchases[_purchaseId].purchasedTime,
            purchases[_purchaseId].shippedTime,
            purchases[_purchaseId].cancelTime,
            purchases[_purchaseId].completedTime,
            purchases[_purchaseId].timeoutTime);
  }

  // Get current state of a purchase
  function getPurchaseState(bytes32 _purchaseId) constant public returns (Status) {
    return purchases[_purchaseId].status;
  }

  // Get seller total number of sales he made
  function getUserSalesNumber(address _user) constant public returns (uint) {
    return userSales[_user];
  }

  // Get total number item sold
  function getItemSalesNumber(bytes32 _itemId) constant public returns (uint) {
    return itemSales[_itemId];
  }

  // Get a seller total number of rating
  //     -- and the accumulated rating score
  //     -- and the total number of reviews left
  function getUserReviews(address _user) constant public returns (uint, uint, uint) {
    return (userReviews[_user].total,
            userReviews[_user].rating,
            userReviews[_user].comments.length);
  }

  // Get one user review ID
  function getUserReviewComment(address _user, uint _index) constant public returns (bytes32) {
    return userReviews[_user].comments[_index];
  }

  // Get an item total number of rating
  //     -- and the accumulated rating score
  //     -- and the total number of reviews left
  function getItemReviews(bytes32 _itemId) constant public returns (uint, uint, uint) {
    return (itemReviews[_itemId].total,
            itemReviews[_itemId].rating,
            itemReviews[_itemId].comments.length);
  }

  // Get one item review ID
  function getItemReviewComment(bytes32 _itemId, uint _index) constant public returns (bytes32) {
    return itemReviews[_itemId].comments[_index];
  }

  // Delete a purchase from the list of pending purchases
  // i.e : when a purchase is complete or cancel
  function deleteOnePurchaseFromPending(uint index) private {
    // Index == -1 means that the item doesn't exist in the array
    require((index !=  uint(-1)) && (index < pendingPurchases.length));

    delete pendingPurchases[index];
    if (pendingPurchases.length >= 2) {
      pendingPurchases[index] = pendingPurchases[pendingPurchases.length - 1];
      delete pendingPurchases[pendingPurchases.length - 1];
    }
    pendingPurchases.length--;
  }

   // Finds the index of a given purchaseId in the pending purchases array.
  function IndexOfPurchase(bytes32 _purchaseId) constant public returns(uint) {
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
  function cancelTimeoutOrders() onlyOwner public {
    for (uint i = 0; i < pendingPurchases.length; i++) {
      // Automatically cancel orders that haven't been shipped before the deadline
      cancelShippingTimeoutOrders(pendingPurchases[i]);
      // Automatically cancel orders that haven't been shipped before the deadline
      cancelConfirmationTimeoutOrders(pendingPurchases[i]);
    }
    clearPendingPurchases();
  }

  // This function will remove all purchases included in pendingPurchasesToDelete array from pendingPurchases
  // Purchase found in pendingPurchasesToDelete : means that the purchase state is not pending anymore
  function clearPendingPurchases() private {
    for (uint i = 0; i < numPendingPurchasesToDelete; i++) {
      deleteOnePurchaseFromPending(IndexOfPurchase(pendingPurchasesToDelete[i]));
    }
    numPendingPurchasesToDelete = 0;
  }

  // Automatically cancel orders that haven't been shipped before the deadline
  function cancelShippingTimeoutOrders(bytes32 _purchaseId) private {
    if ((purchases[_purchaseId].shippingDaysDeadline <  now) && (purchases[_purchaseId].status == Status.Purchased)) {
      if (purchases[_purchaseId].buyer.send(purchases[_purchaseId].amount)) {
        purchases[_purchaseId].status = Status.SellerShippingTimeOut;
        purchases[_purchaseId].amount = 0;
        if (numPendingPurchasesToDelete == pendingPurchasesToDelete.length) {
          pendingPurchasesToDelete.length += 1;
        }
        pendingPurchasesToDelete[numPendingPurchasesToDelete] = _purchaseId;
        numPendingPurchasesToDelete += 1;
        purchases[_purchaseId].timeoutTime = now;
        ShippingTimeout(_purchaseId, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
      }
    }
  }

  // Automatically confirm orders that haven't been confirmed by the users before the deadline
  function cancelConfirmationTimeoutOrders(bytes32 _purchaseId) private {
    if (((purchases[_purchaseId].shippedTime + confirmationDaysDeadline * 1 days) <  now) && (purchases[_purchaseId].status == Status.Shipped)) {
      if (purchases[_purchaseId].seller.send(purchases[_purchaseId].amount)) {
        purchases[_purchaseId].status = Status.BuyerConfirmationTimeOut;
        purchases[_purchaseId].amount = 0;
        if (numPendingPurchasesToDelete == pendingPurchasesToDelete.length) {
          pendingPurchasesToDelete.length += 1;
        }
        pendingPurchasesToDelete[numPendingPurchasesToDelete] = _purchaseId;
        numPendingPurchasesToDelete += 1;
        purchases[_purchaseId].timeoutTime = now;
        ConfirmationTimeout(_purchaseId, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
      }
    }
  }

  // Set a global number of days limitation to confirm a purchase after shipping before it gets automatically confirmed
  function setConfirmationDaysDeadline(uint _day) onlyOwner public {
    confirmationDaysDeadline = _day;
  }
}

