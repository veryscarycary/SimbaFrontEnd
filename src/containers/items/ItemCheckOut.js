import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import PurchaseSummary from '../purchases/PurchaseSummary'

import { createPurchase } from '../../actions/actions_purchases'
import { selectItem } from '../../actions/actions_items'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, current_user } from '../../models/selectors'
import withTransactionWatcher from '../../containers/eth/withTransactionWatcher'

import '../../style/checkout.css'


class ItemCheckOut extends Component {
  state = { finalPrice: 0.0 }

  componentWillMount() {
    this.props.selectItem(this.props.match.params.item_id).then((request) => {
      this.setFinalPrice()
    })
  }

  setFinalPrice() {
    var finalPrice = 0
    if (this.props.item.discount === 0) {
      finalPrice = this.props.item.price + this.props.item.shipping_fee
    } else {
      finalPrice = this.props.item.price - this.props.item.price * (this.props.item.discount / 100) + this.props.item.shipping_fee
    }

    this.setState({finalPrice: finalPrice})
  }

  purchaseItem(event) {
    event.preventDefault()

    this.props.openModal({
      title: 'Processing your order',
      content: "Your order is being transmitted. Please don't close this window until it's finished.",
    })

    this.props.createPurchase(this.props.item, this.state.finalPrice)
      .then(() => this.props.closeModal())
  }

  renderPurchaseConfirmation() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-checkmark-outline"></i>
              <h1>
                Your order has been placed successfully!
              </h1>
            </header>
            <p>
              An e-mail has been sent to <strong>{ this.props.current_user.email }</strong> with a confirmation and a receipt for your order summary, for any doubts you can contact us at support@ecommerce.com.
            </p>
            <Link to='/'>
              Go back to Home Page
            </Link>
          </div>
        </section>
      </div>
    )
  }

  renderErrorPurchase() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-close-outline"></i>
              <h1>
                An error occured. Your order hasn't been placed.
              </h1>
            </header>
            <p>
              Please contact us at support@simba.market if this error persists.
            </p>
            <a href="#" onClick={() => window.location.reload()}>
              Go back to Checkout Page
            </a>
          </div>
        </section>
      </div>
    )
  }

  renderFormOrConfirmation() {
    switch (this.props.purchase.purchaseState) {
      case purchaseState.PURCHASED:
        return this.renderPurchaseConfirmation()
      case purchaseState.ERROR:
        return this.renderErrorPurchase()
      default:
        return this.renderShippingForm()
    }
  }

  renderShippingForm() {
    return (
      <div className="col-md-6">
        <section>
          <h1>Shipping method</h1>

          <div className="field-group">
            <div className="field field--with-radio">
              <input type="radio" id="standard-shipping" name="shipping-method" checked="checked" />
              <label htmlFor="standard-shipping">
                $10 Standard
                <strong className="right-note">
                  5-10 days
                </strong>
              </label>
            </div>
            <div className="field field--with-radio">
              <input type="radio" id="ultra-speed" name="shipping-method" />
              <label htmlFor="ultra-speed">
                $20 Ultra speed
                <strong className="right-note">
                  1-3 days
                </strong>
              </label>
            </div>
          </div>

          <hr/>

          <h1>Client information</h1>

          <div className="field-group">
            <div className="field">
              <label htmlFor="field-name">Your name</label>
              <input id="field-name" type="text" className="form-control" placeholder="Your full name" />
            </div>
            <div className="field">
              <label htmlFor="field-email">Email address</label>
              <input id="field-email" type="email" className="form-control" placeholder="Email address" />
            </div>
          </div>

          <h2>
            Shipping address
          </h2>

          <div className="field-group">
            <div className="field">
              <label htmlFor="field-address">Address</label>
              <input id="field-address" type="text" className="form-control" placeholder="Street, interior number, etc" />
            </div>
            <div className="field">
              <label htmlFor="field-city">City</label>
              <input id="field-city" type="text" className="form-control" placeholder="City" />
            </div>
            <div className="field">
              <label htmlFor="field-zip">ZIP Code</label>
              <input id="field-zip" type="text" className="form-control" placeholder="ZIP Code" />
            </div>
            <div className="field field--with-dropdown clearfix">
              <label htmlFor="field-country">Country</label>
              <select id="field-country">
                <option>Country</option>
                <option>United States</option>
                <option>Canada</option>
                <option>France</option>
                <option>UK</option>
                <option>Germany</option>
                <option>Belgium</option>
                <option>Australia</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="field-phone">Phone</label>
              <input id="field-phone" type="text" className="form-control" placeholder="Phone" />
            </div>
          </div>

          <div className="text-right">
            <a href="/" className="checkout-btn-next-step" onClick={(event) => this.purchaseItem(event)}>
              Place Order
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
            <PurchaseSummary item={this.props.item} finalPrice={this.state.finalPrice} purchase={this.props.purchase} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item : item(state), purchase: purchase(state), current_user: current_user(state) }
}

export default withTransactionWatcher('ItemCheckout')(connect(mapStateToProps, { selectItem, createPurchase })(ItemCheckOut))
