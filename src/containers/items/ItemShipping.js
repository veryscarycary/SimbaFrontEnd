import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'

import PurchaseSummary from '../purchases/PurchaseSummary'

import { selectPurchase } from '../../actions/actions_purchases'
import { sendCode } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, current_user } from '../../models/selectors'

import '../../style/checkout.css'


class ItemShipping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shippingNumber: ''
    }
  }

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

  renderShippingConfirmation() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-checkmark-outline"></i>
              <h1>
                Your shipping number has been sent!
              </h1>
            </header>
            <p>
              Once the product has been delivered, the user will have X days to confirm receiving the item and confirm the payment.
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
      return this.renderShippingForm()
    }
    switch(this.props.purchase.purchaseState) {
      case purchaseState.SHIPPED:
        return this.renderShippingConfirmation()
      case purchaseState.ERROR:
        return this.renderErrorShipping()
      default:
        return this.renderShippingForm()
    }
  }

  renderShippingForm() {
    return (
      <div className="col-md-6">
        <section>
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

          <hr/>

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

          <div className="text-right">
            <a href="#" className="checkout-btn-next-step" onClick={(event) => this.sendCode(this.props.purchase.id, this.state.code, this.props.provider)}>
              Send Shipping Number
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
            <PurchaseSummary item={this.props.item} finalPrice={this.props.purchase.amount}/>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item : item(state), provider: state.provider, purchase: purchase(state), current_user: current_user(state) }
}

export default connect(mapStateToProps, { selectPurchase, sendCode })(ItemShipping)
