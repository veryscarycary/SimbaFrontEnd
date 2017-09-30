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
    return this.escrow.deployed()
  }

  /**
   * Returns the balance for a given wallet
   * @param  {String} wallet
   * @return {Promise}
   */
  getBalance(wallet) {
    return this.providerPromise.then((provider) => provider.Eth.getBalance(wallet, 'latest'))
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
    return this.accounts()
      .then(
        (accounts) => {
          return this.deployed()
            .then((instance) => instance.purchase(
              purchaseId,
              sellerAddress,
              itemId,
              shippingDeadline,
              {
                from: accounts[0],
                value: Eth.toWei(amount, 'ether')
              }
            ))
        }
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
        (accounts) => this.deployed().then((instance) => instance.setCode(
            purchaseId,
            trackingNumber,
            {
              from: accounts[0]
            }
          ))
      )
  }
}

export default new EscrowContract()
