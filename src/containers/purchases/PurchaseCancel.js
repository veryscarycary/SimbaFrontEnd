import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import PurchaseSummary from '../purchases/PurchaseSummary'

import { selectPurchase } from '../../actions/actions_purchases'
import { cancelPurchase } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'
import { purchase, current_user } from '../../models/selectors'
import withTransactionWatcher from '../../containers/eth/withTransactionWatcher'

class PurchaseCancel extends Component {
  componentWillMount() {
    if (this.props.provider.isConnected) {
      this.props.selectPurchase(this.props.provider, this.props.match.params.purchase_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.isConnected && !this.props.provider.isConnected) {
      this.props.selectPurchase(nextProps.provider, this.props.match.params.purchase_id)
    }
  }

  renderCancelConfirmation() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-checkmark-outline"></i>
              <h1>
                Order {this.props.purchase.id} has been successfully cancelled.
              </h1>
            </header>
            <p>
              {this.props.purchase.amount} ETH has been refunded to {this.props.purchase.buyer.fullname}.
            </p>
            <Link to='/'>
              Go back to Home Page
            </Link>
          </div>
        </section>
      </div>
    )
  }

  renderErrorShipping() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-close-outline"></i>
              <h1>
                An error occured while trying to cancel this order.
              </h1>
            </header>
            <p>
              Please contact us at support@simba.market if this error persists.
            </p>
            <a href="#" onClick={() => window.location.reload()}>
              Go back to Shipping Page
            </a>
          </div>
        </section>
      </div>
    )
  }

  renderFormOrConfirmation() {
    if (!this.props.purchase.purchaseState) {
      return this.renderBuyerInformation()
    }
    switch(this.props.purchase.purchaseState) {
      case purchaseState.BUYER_CANCELLED:
      case purchaseState.SELLER_CANCELLED:
        return this.renderCancelConfirmation()
      case purchaseState.ERROR:
        return this.renderErrorShipping()
      default:
        return this.renderBuyerInformation()
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  renderPurchaseDate() {
    var purchaseDate = new Date(0)
    // Convert PurchaseTime epoch to Date Object
    purchaseDate.setUTCSeconds(this.props.purchase.purchased_time)
    return purchaseDate.toLocaleString()
  }

  cancelPurchase(event) {
    event.preventDefault()

    this.props.openModal({
      title: 'Cancelling purchase',
      content: "Your purchase is being cancelled. Please don't close this window until it's finished.",
    })
    const canceller = this.props.purchase.seller === this.props.currentUser.id ? 'seller' : 'buyer'

    this.props.cancelPurchase({
      purchaseId: this.props.purchase.id,
      itemId: this.props.purchase.item.id,
      sellerId: this.props.purchase.seller.id,
      buyerId: this.props.purchase.buyer.id,
      canceller,
    })
      .then(() => this.props.closeModal())
  }

  renderBuyerInformation() {
    const carrierOptions = [
      {value: '', label: 'Please select a carrier…'},
      {value: 'UPS', label: 'UPS'},
      {value: 'FedEx', label: 'FedEx'},
      {value: 'USPS', label: 'USPS'},
    ]

    return (
      <div className="col-md-6">
        <section>
          <h1>Client information</h1>

          <div className="field-group">
            <div className="field">
              <label htmlFor="field-name">Name</label>
              <input id="field-name" type="text" className="form-control" placeholder="Client full name" value={this.props.purchase.buyer.fullname} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-email">Email address</label>
              <input id="field-email" type="email" className="form-control" placeholder="Email address" value={this.props.purchase.buyer.email} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-purchase-date">Purchase Date</label>
              <input id="field-purchase-date" type="text" className="form-control" placeholder="Purchase Date" value={this.renderPurchaseDate()} disabled />
            </div>
          </div>

          <div className="text-right">
            <button href="/" className="checkout-btn-next-step" onClick={(event) => this.cancelPurchase(event)}>
              Cancel Order
              <i className="ion-chevron-right"></i>
            </button>
          </div>
        </section>
      </div>
    )
  }

  render() {
    if (!this.props.purchase.id) {
      return <div>Loading..</div>
    }
    return (
      <div id="checkout">
        <div className="container">
          <div className="row">
            { this.renderFormOrConfirmation() }
            <PurchaseSummary item={this.props.purchase.item} finalPrice={this.props.purchase.amount} purchase={this.props.purchase} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { provider: state.provider, purchase: purchase(state), currentUser : current_user(state) }
}

export default withTransactionWatcher('Cancel modal')(connect(mapStateToProps, { selectPurchase, cancelPurchase })(PurchaseCancel))
