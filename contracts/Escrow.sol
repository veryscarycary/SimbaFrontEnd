pragma solidity ^0.4.15; //We have to specify what version of compiler this code will use

import './SafeMath.sol';

contract Escrow {
  using SafeMath for uint256;

  enum Status {Pending, Purchased, Shipped, Completed, BuyerCancelled, SellerCancelled, SellerShippingTimeOut, BuyerConfirmationTimeOut}
  // enum Category {Good, Digital, Service, Auction}

  struct Purchase {
    uint256 amount;
    address seller;
    address buyer;
    Status status;
    bytes32 code;
    bytes32 itemId;
    // Category category;
    uint shippingDaysDeadline;
    uint purchasedTime;
    uint shippedTime;
    uint cancelTime;
    uint completedTime;
    uint timeoutTime;
    uint confirmationDaysDeadline;
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
    uint256 balance;
  }

  struct Item {
    bytes32 itemId;
    Review review;
    uint salesNumber;
  }

  address owner;
  mapping(bytes32 => Purchase) purchases;
  mapping(address => User) users;
  mapping(bytes32 => Item) items;

  // bytes32[] private pendingPurchases;
  // bytes32[] private pendingPurchasesToDelete;
  // uint private numPendingPurchasesToDelete = 0;

  event ItemPurchased(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint256 amount);
  event ItemShipped(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, bytes32 code);
  event PurchaseCompleted(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint256 amount);
  event PurchaseCancelled(bytes32 purchaseId, address sender, address buyer, address seller, bytes32 itemId, uint256 amount);
  event ShippingTimeout(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint256 amount);
  event ConfirmationTimeout(bytes32 purchaseId, address buyer, address seller, bytes32 itemId, uint256 amount);
  event Withdrawal(address sender, uint256 amount);

  function Escrow() {
    owner = msg.sender;
  }


  /**
   * @dev Guarantee that the sender is the creator of the contract (the one who deployed it)
   */
  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  /**
   * @dev Guarantee that the sender is the buyer of the purchase
   * @param _buyer wallet address of buyer
   */
  modifier onlyBuyer(address _buyer) {
    require(msg.sender == _buyer);
    _;
  }

  /**
   * @dev Guarantee that the sender is the Seller of the purchase
   * @param _seller wallet address of seller
   */
  modifier onlySeller(address _seller) {
    require(msg.sender == _seller);
    _;
  }

  /**
   * @dev Guarantee that the sender is either a buyer or seller of his transaction
   * @param _buyer wallet address of buyer
   * @param _seller wallet address of seller
   */
  modifier onlyBuyerOrSeller(address _buyer, address _seller) {
    require(msg.sender == _buyer || msg.sender == _seller);
    _;
  }

  /**
   * @dev Prevent a buyer from buying an item he listed himself
   * @param _buyer wallet address of buyer
   * @param _seller wallet address of seller
   */
  modifier preventSelfBuy(address _buyer, address _seller) {
    require(_buyer != _seller);
    _;
  }

  /**
   * @dev Require that current state of purchase "_purchaseState" is equal to "_tmpState"
   * @param _purchase current purchase
   * @param _requirePurchaseState purchase status we want the purchase to be equal to
   */
  modifier onlyForPurchaseState(Purchase _purchase, Status _requirePurchaseState) {
    require(_purchase.status == _requirePurchaseState);
    _;
  }

  /**
   * @dev Buyer Purchase an item '_itemId' from Seller (_seller) - State of the purchase : "Purchased"
   * @param _purchaseId ID of _purchase
   * @param _seller wallet address of _seller
   * @param _itemId ID of _item
   * @param _shippingDaysDeadline seller needs to ship the item within _shippingDaysDeadline days after purchase or purchase will be timeout and cancelled
   */
  function purchase(bytes32 _purchaseId, address _seller, bytes32 _itemId, uint _shippingDaysDeadline)
  preventSelfBuy(msg.sender, _seller)
  payable public
  {
    require(_shippingDaysDeadline > 0);
    require(_seller != 0);
    require(_purchaseId != '' && _itemId != '');
    require(msg.value > 0);
    purchases[_purchaseId].itemId = _itemId;
    purchases[_purchaseId].seller = _seller;
    purchases[_purchaseId].buyer = msg.sender;
    purchases[_purchaseId].status = Status.Purchased;
    purchases[_purchaseId].amount = msg.value;
    purchases[_purchaseId].purchasedTime = now;
    purchases[_purchaseId].shippingDaysDeadline = now + _shippingDaysDeadline * 1 days;
    //pendingPurchases.push(_purchaseId);
    ItemPurchased(_purchaseId, msg.sender, _seller, _itemId, msg.value);
  }

  /**
   * @dev Seller send the code to Buyer (Code can be a tracking number, a digital code, a coupon) [ State of the purchase : "Shipped"]
   * @param _purchaseId [ID of purchaseID in Database]
   * @param _code [shipping tracking number, digital code, coupon, etc..]
   */
  function setCode(bytes32 _purchaseId, bytes32 _code)
  onlySeller(purchases[_purchaseId].seller)
  public
  {
    require(_code != '');
    purchases[_purchaseId].code = _code;
    purchases[_purchaseId].status = Status.Shipped;
    purchases[_purchaseId].shippedTime = now;
    ItemShipped(_purchaseId, purchases[_purchaseId].buyer, msg.sender, purchases[_purchaseId].itemId, _code);
  }

  /**
   * @dev Buyer confirms receive the code from the Seller - Balance is added to Seller mapping [State of the purchase : "Completed"]
   * @param _purchaseId   [ID of purchaseID in Database]
   * @param  _userReviewId [ID of Review in Database]
   * @param _itemReviewId [ID of Review in Database]
   * @param _userRating   [Value between 1-5]
   * @param _itemRating   [Value between 1-5]
   */
  function confirmPurchase(bytes32 _purchaseId, bytes32 _userReviewId, bytes32 _itemReviewId, uint _userRating, uint _itemRating)
  onlyBuyer(purchases[_purchaseId].buyer)
  public
  {
    require(_purchaseId != 0);
    // Delete Purchase from list of pending purchase
    // deleteOnePurchaseFromPending(_purchaseId);

    // Set user & item review & rating
    setReview(false, _purchaseId, _itemReviewId, _itemRating);
    setReview(true, _purchaseId, _userReviewId, _userRating);

    // Set user & item total sales Number
    users[purchases[_purchaseId].seller].salesNumber += 1;
    items[purchases[_purchaseId].itemId].salesNumber += 1;

    purchases[_purchaseId].completedTime = now;
    purchases[_purchaseId].status = Status.Completed;
    users[purchases[_purchaseId].seller].balance = users[purchases[_purchaseId].seller].balance.add(purchases[_purchaseId].amount);
    PurchaseCompleted(_purchaseId, msg.sender, purchases[_purchaseId].seller, purchases[_purchaseId].itemId, purchases[_purchaseId].amount);
  }

  /**
   * @dev Set Item or Users's review & rating
   * @param isUserReview [Distinguish if we're setting an Item or an User Review]
   * @param _purchaseId  [ID of purchase in Database]
   * @param _reviewId    [ID of Review in Database]
   * @param _rating      [Value between 1-5]
   */
  function setReview(bool isUserReview, bytes32 _purchaseId, bytes32 _reviewId, uint _rating) private {
    Review review;
    if (isUserReview) {
      review = users[purchases[_purchaseId].seller].review;
    } else {
      review = items[purchases[_purchaseId].itemId].review;
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

  /**
   * @dev Cancel a Purchase by a buyer or a seller - can only happen before the item has been shipped
   * @param _purchaseId   [ID of purchase in Database]
   */
  function cancelPurchase(bytes32 _purchaseId)
  onlyForPurchaseState(purchases[_purchaseId], Status.Purchased)
  onlyBuyerOrSeller(purchases[_purchaseId].buyer, purchases[_purchaseId].seller)
  public
  {
    if (purchases[_purchaseId].buyer == msg.sender) {
      purchases[_purchaseId].status = Status.BuyerCancelled;
    } else {
      purchases[_purchaseId].status = Status.SellerCancelled;
    }
    purchases[_purchaseId].cancelTime = now;
    users[purchases[_purchaseId].buyer].balance = users[purchases[_purchaseId].buyer].balance.add(purchases[_purchaseId].amount);
    PurchaseCancelled(
      _purchaseId,
      msg.sender,
      purchases[_purchaseId].buyer,
      purchases[_purchaseId].seller,
      purchases[_purchaseId].itemId,
      purchases[_purchaseId].amount
    );
    //deleteOnePurchaseFromPending(_purchaseId);
  }

  /**
   * @dev Get msg.sender current balance (money available to be withdrawn anytime)
   * @return uint [msg.sender balance]
   */
  function getUserBalance() constant public returns (uint) {
    return users[msg.sender].balance;
  }


  /**
   * @dev Withdraw your current balance (Contract) to your own wallet
   */
  function withdraw() public {
    require(
      users[msg.sender].balance > 0 &&
      this.balance >= users[msg.sender].balance)
    ;
    uint256 amount = users[msg.sender].balance;
    users[msg.sender].balance = 0;
    msg.sender.transfer(amount);
    Withdrawal(msg.sender, amount);
  }


  /**
   * @dev Get All Status Time for a Purchase
   * @param _purchaseId [ID of purchase in database]
   * @return uint shippingDaysDeadline [Block time when purchase will be considered in shipping Timeout]
   * @return uint purchasedTime [Block time when purchase state reached Status.Purchased]
   * @return uint shippedTime [Block time when purchase state reached Status.Shipped]
   * @return uint cancelTime [Block time when purchase state reached Status.Cancelled]
   * @return uint completedTime [Block time when purchase state reached Status.Completed]
   * @return uint timeoutTime [Block time when a timeout occured (shipping/confirmation timeout)]
   */
  function getPurchaseTimes(bytes32 _purchaseId) constant public returns (uint, uint, uint, uint, uint, uint) {
    return (purchases[_purchaseId].shippingDaysDeadline,
            purchases[_purchaseId].purchasedTime,
            purchases[_purchaseId].shippedTime,
            purchases[_purchaseId].cancelTime,
            purchases[_purchaseId].completedTime,
            purchases[_purchaseId].timeoutTime);
  }

  /**
   * @dev Get current state of a purchase
   * @param _purchaseId [Purchase ID in the Database]
   * @return Status [Purchase State]
   */
  function getPurchaseState(bytes32 _purchaseId) constant public returns (Status) {
    return purchases[_purchaseId].status;
  }

  /**
   *  Get seller total number of sales he made
   * @param _user [wallet address of user]
   * @return uint [number of total seller's sales]
   */
  function getUserSalesNumber(address _user) constant public returns (uint) {
    return users[_user].salesNumber;
  }

  /**
   * @dev Get total number item sold
   * @param _itemId [ID of item in database]
   * @return uint [number of total item sold]
   */
  function getItemSalesNumber(bytes32 _itemId) constant public returns (uint) {
    return items[_itemId].salesNumber;
  }

  /**
   * @dev Get a seller ratings + reviews
   * @param _user [address of User wallet in database]
   * @return uint [Total Number of Rating]
   * @return uint [Accumulated value of all user ratings]
   * @return uint [Total Number of user reviews]
   */
  function getUserReviews(address _user) constant public returns (uint, uint, uint) {
    return (users[_user].review.total,
            users[_user].review.rating,
            users[_user].review.comments.length);
  }

  /**
   * @dev Get a single review for a Seller
   * @param _user [address of User wallet in database]
   * @param _index [index of the user review in the comments array]
   * @return bytes32 [ID of the User Review in Database]
   */
  function getUserReviewComment(address _user, uint _index) constant public returns (bytes32) {
    return users[_user].review.comments[_index];
  }

  /**
   * @dev Get a single item its ratings + reviews
   * @param _itemId [ID of Item in database]
   * @return uint [Total Number of item ratings]
   * @return uint [Accumulated value of all item ratings]
   * @return uint [Total Number of item reviews]
   */
  function getItemReviews(bytes32 _itemId) constant public returns (uint, uint, uint) {
    return (items[_itemId].review.total,
            items[_itemId].review.rating,
            items[_itemId].review.comments.length);
  }

  /**
   * @dev Get a single item review
   * @param _itemId [ID of item in database]
   * @param _index [index of the item review in the comments array]
   * @return bytes32 [ID of the User Review in Database]
   */
  function getItemReviewComment(bytes32 _itemId, uint _index) constant public returns (bytes32) {
    return items[_itemId].review.comments[_index];
  }

  // Delete a purchase from the list of pending purchases
  // i.e : when a purchase is complete or cancel
  // function deleteOnePurchaseFromPending(bytes32 _purchaseId) private {
  //   // Index == -1 means that the item doesn't exist in the array
  //   require(
  //     (IndexOfPurchase(_purchaseId) != uint(-1)) &&
  //     (IndexOfPurchase(_purchaseId) < pendingPurchases.length)
  //   );

  //   delete pendingPurchases[index];
  //   if (pendingPurchases.length >= 2) {
  //     pendingPurchases[index] = pendingPurchases[pendingPurchases.length - 1];
  //     delete pendingPurchases[pendingPurchases.length - 1];
  //   }
  //   pendingPurchases.length--;

  //   require(IndexOfPurchase(_purchaseId) == uint(-1));
  // }

   // Finds the index of a given purchaseId in the pending purchases array.
  // function IndexOfPurchase(bytes32 _purchaseId) constant public returns(uint) {
  //   for (uint i = 0; i < pendingPurchases.length; i++) {
  //     if (pendingPurchases[i] == _purchaseId) {
  //       return i;
  //     }
  //   }
  //   // Index not found
  //   return uint(-1);
  // }

  // Main auto cancel function
  //   -- cancel shipping Timeout orders
  //   -- cancel confirmation timeout orders
  // function cancelTimeoutOrders() onlyOwner public {
  //   for (uint i = 0; i < pendingPurchases.length; i++) {
  //     // Automatically cancel orders that haven't been shipped before the deadline
  //     cancelShippingTimeoutOrders(pendingPurchases[i]);
  //     // Automatically cancel orders that haven't been shipped before the deadline
  //     cancelConfirmationTimeoutOrders(pendingPurchases[i]);
  //   }
  //   clearPendingPurchases();
  // }

  // This function will remove all purchases included in pendingPurchasesToDelete array from pendingPurchases
  // Purchase found in pendingPurchasesToDelete : means that the purchase state is not pending anymore
  // function clearPendingPurchases() private {
  //   for (uint i = 0; i < numPendingPurchasesToDelete; i++) {
  //     deleteOnePurchaseFromPending(pendingPurchasesToDelete[i]);
  //   }
  //   numPendingPurchasesToDelete = 0;
  // }

  // Automatically cancel orders that haven't been shipped before the deadline
  // function cancelShippingTimeoutOrders(bytes32 _purchaseId) private {
  //   if ((purchases[_purchaseId].shippingDaysDeadline <  now) && (purchases[_purchaseId].status == Status.Purchased)) {
  //     if (purchases[_purchaseId].buyer.send(purchases[_purchaseId].amount)) {
  //       purchases[_purchaseId].status = Status.SellerShippingTimeOut;
  //       purchases[_purchaseId].amount = 0;
  //       if (numPendingPurchasesToDelete == pendingPurchasesToDelete.length) {
  //         pendingPurchasesToDelete.length += 1;
  //       }
  //       pendingPurchasesToDelete[numPendingPurchasesToDelete] = _purchaseId;
  //       numPendingPurchasesToDelete += 1;
  //       purchases[_purchaseId].timeoutTime = now;
  //       ShippingTimeout(_purchaseId, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
  //     }
  //   }
  // }

  // Automatically confirm orders that haven't been confirmed by the users before the deadline
  // function cancelConfirmationTimeoutOrders(bytes32 _purchaseId) private {
  //   if (((purchases[_purchaseId].shippedTime + confirmationDaysDeadline * 1 days) <  now) && (purchases[_purchaseId].status == Status.Shipped)) {
  //     if (purchases[_purchaseId].seller.send(purchases[_purchaseId].amount)) {
  //       purchases[_purchaseId].status = Status.BuyerConfirmationTimeOut;
  //       purchases[_purchaseId].amount = 0;
  //       if (numPendingPurchasesToDelete == pendingPurchasesToDelete.length) {
  //         pendingPurchasesToDelete.length += 1;
  //       }
  //       pendingPurchasesToDelete[numPendingPurchasesToDelete] = _purchaseId;
  //       numPendingPurchasesToDelete += 1;
  //       purchases[_purchaseId].timeoutTime = now;
  //       ConfirmationTimeout(_purchaseId, purchases[_purchaseId].buyer, purchases[_purchaseId].seller, purchases[_purchaseId].itemId);
  //     }
  //   }
  // }

  // Set a global number of days limitation to confirm a purchase after shipping before it gets automatically confirmed
  // function setConfirmationDaysDeadline(uint _day) onlyOwner public {
  //   confirmationDaysDeadline = _day;
  // }

  /**
   * @dev Get total balance of the Escrow contract
   * @return uint [total balance of Escrow contract]
   */
  function getBalance() onlyOwner constant public returns (uint) {
    return this.balance;
  }

  /**
   * @dev Kill the contract and send all the balance to the contract owner
   */
  function killContract() onlyOwner public {
    selfdestruct(owner);
  }
}

