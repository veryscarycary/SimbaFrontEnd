import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import PurchaseSummary from '../purchases/PurchaseSummary'

import { selectPurchase } from '../../actions/actions_purchases'
import { cancelPurchase } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, current_user, user } from '../../models/selectors'


class PurchaseCancel extends Component {
  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.selectPurchase(this.props.provider, this.props.match.params.purchase_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
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
              {this.props.purchase.amount} ETH has been refunded to {this.props.user.fullname}.
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
                An error occured. Your shipping number hasn't been sent.
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
      case purchaseState.PENDING_CANCELLED:
        // Modal For Pending Shipping Transaction
      default:
        return this.renderBuyerInformation()
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.sendCode(this.props.purchase.id, this.state.shippingNumber, this.props.provider)
  }

  renderPurchaseDate() {
    var purchaseDate = new Date(0)
    // Convert PurchaseTime epoch to Date Object
    purchaseDate.setUTCSeconds(this.props.purchase.purchased_time)
    return purchaseDate.toLocaleString()
  }

  cancelPurchase(event) {
    event.preventDefault()
    this.props.cancelPurchase(this.props.purchase.id, this.props.provider)
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
              <input id="field-name" type="text" className="form-control" placeholder="Client full name" value={this.props.user.fullname} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-email">Email address</label>
              <input id="field-email" type="email" className="form-control" placeholder="Email address" value={this.props.user.email} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-purchase-date">Purchase Date</label>
              <input id="field-purchase-date" type="text" className="form-control" placeholder="Purchase Date" value={this.renderPurchaseDate()} disabled />
            </div>
          </div>

          <div className="text-right">
            <a href="/" className="checkout-btn-next-step" onClick={(event) => this.cancelPurchase(event)}>
              Cancel Order
              <i className="ion-chevron-right"></i>
            </a>
          </div>
        </section>
      </div>
    )
  }

  render() {
    if (!this.props.item.name) {
      return <div>Loading..</div>
    }
    return (
      <div id="checkout">
        <div className="container">
          <div className="row">
            { this.renderFormOrConfirmation() }
            <PurchaseSummary item={this.props.item} finalPrice={this.props.purchase.amount} purchase={this.props.purchase} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item : item(state), provider: state.provider, purchase: purchase(state), current_user: current_user(state), user: user(state) }
}

export default connect(mapStateToProps, { selectPurchase, cancelPurchase })(PurchaseCancel)
