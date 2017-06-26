pragma solidity ^0.4.10; //We have to specify what version of compiler this code will use

contract Escrow {
  address public owner;
  uint public amount;
  address public seller;
  address public buyer;
  enum Status {Purchased, Shipped, Completed, Cancelled}
  Status public status;
  bytes32 public trackingNumber;

  event Purchase(address sender, uint amount);
  event Shipped(address sender, bytes32 trackingNumber);
  event PurchaseConfirmation(address sender);
  event CancelPurchase(address sender);

  modifier onlyBuyer() {
    require(msg.sender == buyer);
    _;
  }

  modifier onlySeller() {
    require(msg.sender == seller);
    _;
  }

  modifier onlyOwner() {
    require(msg.sender == owner);
    _;
  }

  function Escrow(address _buyer, address _seller) {
    seller = _seller;
    buyer = _buyer;
    owner = msg.sender;
  }

  function purchase() onlyBuyer payable {
    amount = msg.value;
    status = Status.Purchased;
    Purchase(msg.sender, msg.value);
  }

  function setTrackingNumber(bytes32 _trackingNumber) onlySeller {
    trackingNumber = _trackingNumber;
    status = Status.Shipped;
    Shipped(msg.sender, trackingNumber);
  }

  function confirmPurchase() onlyBuyer {
    if (seller.send(amount)) {
      amount = 0;
      status = Status.Completed;
      PurchaseConfirmation(msg.sender);
    }
  }

  function cancelPurchase() onlyBuyer {
    if (buyer.send(amount)) {
      status = Status.Cancelled;
      amount = 0;
      CancelPurchase(msg.sender);
    }
  }

  function setSeller(address _seller) onlyOwner {
    seller = _seller;
  }

  // function setup(address seller, address buyer){
  //   if(msg.sender == escrow){
  //       seller = seller;
  //       buyer = buyer;
  //   }
  // }

  // function approve(){
  //   if(msg.sender == buyer) buyerApprove = true;
  //   else if(msg.sender == seller) sellerApprove = true;
  //   if(sellerApprove && buyerApprove) fee();
  // }

  // function abort(){
  //     if(msg.sender == buyer) buyerApprove = false;
  //     else if (msg.sender == seller) sellerApprove = false;
  //     if(!sellerApprove && !buyerApprove) refund();
  // }

  // function payOut(){
  //   if(seller.send(this.balance)) balances[buyer] = 0;
  // }

  // function deposit(){
  //     if(msg.sender == buyer) balances[buyer] += msg.value;
  //     else throw;
  // }

  // function killContract() internal {
  //     selfdestruct(escrow);
  //     //kills contract and returns funds to buyer
  // }

  // function refund(){
  //   if(buyerApprove == false && sellerApprove == false) selfdestruct(buyer);
  //   //send money back to recipient if both parties agree contract is void
  // }

  // function fee(){
  //     escrow.send(this.balance / 100); //1% fee
  //     payOut();
  // }

}

