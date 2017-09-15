import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import Rating from 'react-rating'
import { Link } from 'react-router-dom'

import ReviewShow from '../reviews/ReviewShow'
import PurchaseSummary from '../purchases/PurchaseSummary'

import { createPurchase } from '../../actions/actions_purchases'
import { selectItem } from '../../actions/actions_items'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, current_user } from '../../models/selectors'

import '../../style/checkout.css'


class ItemCheckOut extends Component {
  constructor(props) {
    super(props)

    this.state = {
      finalPrice: 0.0
    }
  }

  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.selectItem(this.props.provider, this.props.match.params.item_id).then((request) => {
        this.setFinalPrice()
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.selectItem(nextProps.provider, this.props.match.params.item_id).then((request) => {
        this.setFinalPrice()
      })
    }
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
    this.props.createPurchase(this.props.item, this.state.finalPrice, this.props.provider)
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
    if (!this.props.purchase.purchaseState) {
      return this.renderShippingForm()
    }
    switch(this.props.purchase.purchaseState) {
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
            <a href="#" className="checkout-btn-next-step" onClick={(event) => this.purchaseItem(event)}>
              Place Order
              <i className="ion-chevron-right"></i>
            </a>
          </div>
        </section>
      </div>
    )
  }

  renderOrderSummary() {
    return (
      <div className="col-md-6">
        <div id="checkout-cart-summary" className="clearfix float-right">
          <h3>Order Summary</h3>
          <div className="line-items">
            <div className="item clearfix">
              <div className="pic">
                <img src={ this.props.item.picture } className="img-responsive" />
              </div>
              <div className="details">
                <span className="name">
                  { this.props.item.name }
                </span>
                <span className="variant">
                  Ship within { this.props.item.shipping_deadline } days
                </span>
              </div>
              <div className="price float-right">
                { this.props.item.price } ETH
              </div>
            </div>
          </div>
          <div className="price-details">
            { this.renderDiscount() }
            <div className="detail clearfix">
              <p>Shipping</p>
              <span>{ this.props.item.shipping_fee } ETH</span>
            </div>
            <div className="detail clearfix">
              <p>Taxes</p>
              <span>$15.00</span>
            </div>
            <div className="total-price clearfix">
              <p>Total payment</p>
              <span>{ this.state.finalPrice } ETH</span>
            </div>
          </div>
        </div>
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
            <PurchaseSummary item={this.props.item} finalPrice={this.state.finalPrice}/>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item : item(state), provider: state.provider, purchase: purchase(state), current_user: current_user(state) }
}

export default connect(mapStateToProps, { selectItem, createPurchase })(ItemCheckOut)
