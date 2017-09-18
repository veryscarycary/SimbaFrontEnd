import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Input, Select } from 'formsy-react-components'

import PurchaseSummary from '../purchases/PurchaseSummary'

import { selectPurchase } from '../../actions/actions_purchases'
import { sendCode } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, current_user, user } from '../../models/selectors'

import '../../style/purchase-shipping.css'


class PurchaseShipping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      shippingNumber: '',
      shippingCarrier: ''
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
                Your shipping number {this.state.shippingNumber} ({this.state.shippingCarrier}) has been sent!
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
      case purchaseState.PENDING_SHIPPED:
        // Modal For Pending Shipping Transaction
      default:
        return this.renderShippingForm()
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.sendCode(this.props.purchase.id, this.state.shippingNumber, this.props.provider)
  }

  renderShippingDeadlineDate() {
    var deadlineDate = new Date(0)
    // Convert PurchaseTime epoch to Date Object
    deadlineDate.setUTCSeconds(this.props.purchase.shipping_deadline_time)
    return deadlineDate.toLocaleString()
  }

  renderShippingForm() {
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
          </div>

          <h2>
            Shipping address
          </h2>

          <div className="field-group">
            <div className="field">
              <label htmlFor="field-address">Address</label>
              <input id="field-address" type="text" className="form-control" placeholder="Street, interior number, etc" value={this.props.purchase.address} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-city">City</label>
              <input id="field-city" type="text" className="form-control" placeholder="City" value={this.props.purchase.city} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-zip">ZIP Code</label>
              <input id="field-zip" type="text" className="form-control" placeholder="ZIP Code" value={this.props.purchase.postal_code} disabled />
            </div>
            <div className="field field--with-dropdown clearfix">
              <label htmlFor="field-country">Country</label>
              <input id="field-country" type="text" className="form-control" placeholder="Country Code" value={this.props.purchase.country} disabled />
            </div>
            <div className="field">
              <label htmlFor="field-phone">Phone</label>
              <input id="field-phone" type="text" className="form-control" placeholder="Phone" disabled />
            </div>
          </div>

          <hr/>

          <h1>Shipping Information</h1>

          <Form layout='vertical' onValidSubmit={this.submit.bind(this)}>
            <div className="field-group">
              <div className="field">
                <Input
                  label='Shipping Deadline'
                  value={this.renderShippingDeadlineDate()}
                  name='shippingDeadline'
                  type='text'
                  required
                  className='form-control'
                  disabled />
              </div>

              <div className="field field--with-dropdown clearfix">
                <Select
                  name="shippingCarrier"
                  label="Shipping Carrier"
                  options={carrierOptions}
                  value={this.state.shippingCarrier}
                  onChange={this.handleChange.bind(this)}
                  required
                  />
              </div>

              <div className="field">
                <Input
                  label='Tracking Number'
                  value={this.state.shippingNumber}
                  name='shippingNumber'
                  type='text'
                  placeholder='Tracking Number'
                  onChange={this.handleChange.bind(this)}
                  required
                  className='form-control' />
              </div>
            </div>

            <div className="text-right">
              <button type="submit" className="checkout-btn-next-step">
                Send Shipping Number
                <i className="ion-chevron-right"></i>
              </button>
            </div>
          </Form>
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

export default connect(mapStateToProps, { selectPurchase, sendCode })(PurchaseShipping)
