import TruffleContract from 'truffle-contract'
import Eth from 'ethjs'
import escrowJSON from '../contract_build/Escrow.json'
import getProvider from '../utils/getProvider'

class EscrowContract {
  constructor() {
    this.escrow = TruffleContract(escrowJSON)
    this.initializeProvider()
  }

  initializeProvider() {
    this.providerPromise = getProvider()
      .then((provider) => {
        this.provider = provider
        this.escrow.setProvider(provider.Eth.currentProvider)

        return provider
      })
  }

  setEscrowProvider(provider) {
    this.escrow.setProvider(provider.Eth.currentProvider)
  }

  /**
   * Returns the provider
   * @return {Promise}
   */
  provider() {
    return this.providerPromise
  }

  /**
   * Returns the accounts linked in metmask
   * @return {Promise}
   */
  accounts() {
    return this.providerPromise.then((provider) => provider.Eth.accounts())
  }

  /**
   * Returns true if the escrow is deployed
   * @return {Promise}
   */
  deployed() {
    return this.providerPromise.then(() => this.escrow.deployed())
  }

  /**
   * Proxies getter method to the instance
   * @param  {Strign} methodName
   * @param  {Array} args
   * @return {Promise}
   */
  _callEscrowMethod(methodName, ...args) {
    return this.deployed()
      .then((instance) => {
        console.log('_callEscrowMethod', methodName, args)
        return instance[methodName].apply(this, args)
      })
  }

  /**
   * Purchases an item
   * @param  {String} options.purchaseId
   * @param  {String} options.sellerAddress
   * @param  {String} options.itemId
   * @param  {Number} options.amount
   * @param  {String} options.shippingDeadline
   * @return {Promise}
   */
  purchaseItem({ purchaseId, sellerAddress, itemId, amount, shippingDeadline }) {
    return this.accounts()
      .then(
        (accounts) => this._callEscrowMethod(
          'purchase',
          purchaseId,
          sellerAddress,
          itemId,
          shippingDeadline,
          {
            from: accounts[0],
            value: Eth.toWei(amount, 'ether')
          }
        )
      )
  }

  /**
   * Writes the shipping information in the blockchain
   * @param  {String} options.purchaseId
   * @param  {String} options.trackingNumber
   * @return {Promise}
   */
  sendShippingInformation({ purchaseId, trackingNumber }) {
    return this.accounts()
      .then(
        (accounts) => this._callEscrowMethod(
          'setCode',
          purchaseId,
          trackingNumber,
          {
            from: accounts[0]
          }
        )
      )
  }

  /**
   * Confirms and complete the purchase
   * @param  {String} options.purchaseId
   * @param  {String} options.userReviewId
   * @param  {String} options.itemReviewId
   * @param  {Number} options.userRating
   * @param  {Number} options.itemRating
   * @return {Promise}
   */
  confirmPurchase({ purchaseId, userReviewId, itemReviewId, userRating, itemRating }) {
    return this.accounts()
      .then(
        (accounts) => this._callEscrowMethod(
          'confirmPurchase',
          purchaseId,
          userReviewId,
          itemReviewId,
          userRating,
          itemRating,
          {
            from: accounts[0]
          }
        )
      )
  }

  /**
   * Cancels a purchase
   * @param  {String} options.purchaseId
   * @return {Promise}
   */
  cancelPurchase(purchaseId) {
    return this.accounts()
      .then(
        (accounts) => this._callEscrowMethod(
          'cancelPurchase',
            purchaseId,
            {
              from: accounts[0]
            }
          )
      )
  }

  /**
   * Fetches the purchase state
   * @param  {String} options.purchaseId
   * @return {Promise}
   */
  getPurchaseState(purchaseId) {
    return this._callEscrowMethod('getPurchaseState', purchaseId)
  }

  /**
   * Fetches the purchases deadlines
   * @param  {String} purchaseId
   * @return {Promise}
   */
  getPurchaseTimes(purchaseId) {
    return this._callEscrowMethod('getPurchaseTimes', purchaseId)
  }

  /**
   * Gets the users sales
   * @param  {String} wallet
   * @return {Promise}
   */
  getUserSalesNumber(wallet) {
    return this._callEscrowMethod('getUserSalesNumber', wallet)
  }

  /**
   * Retrieve total number of sales for an Item
   * @param  {String} itemId
   * @return {Promise}
   */
  getItemSalesNumber(itemId) {
    return this._callEscrowMethod('getItemSalesNumber', itemId)
  }

  /**
   * Retrieve a User rating and # of reviews
   * @param  {String} wallet
   * @return {Promise}
   */
  getUserReviews(wallet) {
    return this._callEscrowMethod('getUserReviews', wallet)
  }


  /**
   * Retrieve a Item rating and # of reviews
   * @param  {String} itemId
   * @return {Promise}
   */
  getItemReviews(itemId) {
    return this._callEscrowMethod('getItemReviews', itemId)
  }

  /**
   * Retrieve list of Items reviews ID
   * @param  {String} itemId
   * @param  {Number} i
   * @return {Promise}
   */
  getItemReviewComment(itemId, index) {
    return this._callEscrowMethod('getItemReviewComment', itemId, index)
  }

  /**
   * Retrieve list of Users reviews ID
   * @param  {String} wallet
   * @param  {Number} index
   * @return {Promise}
   */
  getUserReviewComment(wallet, index) {
    return this._callEscrowMethod('getUserReviewComment', wallet, index)
  }

  /**
   * Automatically cancels orders if seller hasn't shipped the items before the shipping deadlines -
   * State of the purchase : "SELLER_SHIPPING_TIMEOUT"
   * and automatically confirms orders if buyer hasn't confirmed the reception of the item before the confirmation
   * deadlines - State of the purchase : "BUYER_CONFIRMATION_TIMEOUT"
   * @return {Promise}
   */
  cancelTimeoutOrders() {
    return this.accounts()
      .then(
        (accounts) => this._callEscrowMethod(
          'cancelTimeoutOrders',
            {
              from: accounts[0]
            }
          )
      )
  }

  /**
   * Fetch Total Balance of Escrow smart contract
   * @return {Promise}
   */
  getBalance() {
    return this._callEscrowMethod(
      'getBalance'
    )
  }

  /**
   * Fetch User Balance inside the smart contract (avaiable to be withdraw)
   * @return {Promise}
   */
  getUserBalance(wallet) {
    return this._callEscrowMethod(
      'getUserBalance', wallet
    )
  }

  /**
   * withdraw user funds available inside the smart contract
   * @return {Promise}
   */
  withdraw() {
    return this.accounts()
      .then(
        (accounts) => this._callEscrowMethod(
          'withdraw', { from: accounts[0] }
        )
      )
  }
}

export default new EscrowContract()
