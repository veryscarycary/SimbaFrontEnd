import TruffleContract from 'truffle-contract'
import Eth from 'ethjs'
import escrowJSON from '../contract_build/Escrow.json'
import getProvider from '../utils/getProvider'

class EscrowContract {
  constructor() {
    this.escrow = TruffleContract(escrowJSON)
    this._provider = getProvider() // This is a promise
  }

  /**
   * Returns the provider
   * @return {Promise}
   */
  provider() {
    return this._provider
  }

  /**
   * Returns the accounts linked in metmask
   * @return {Promise}
   */
  accounts() {
    return this._provider.then((provider) => provider.Eth.accounts())
  }

  /**
   * Returns true if the escrow is deployed
   * @return {Promise}
   */
  deployed() {
    this.escrow.deployed()
  }

  /**
   * Returns the balance for a given wallet
   * @param  {String} wallet
   * @return {Promise}
   */
  getBalance(wallet) {
    this._provider.then((provider) => provider.Eth.getBalance(wallet, 'latest'))
  }

  /**
   * Fetch the escrow balance
   * @return {Promise}
   */
  fetchEscrowBalance() {
    return this.deployed().then((instance) => instance.getBalance())
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
    return this.accounts((accounts) => {
      return this.deployed()
        .then((instance) => {
          return instance.purchase.sendTransaction(
            purchaseId,
            sellerAddress,
            itemId,
            shippingDeadline,
            {
              from: accounts[0],
              value: Eth.toWei(amount, 'ether')
            }
          )
        })
    })
  }
}

export default new EscrowContract()
