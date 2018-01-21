import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Timestamp from 'react-timestamp'
import { selectPurchase } from '../../actions/actions_purchases'
import { purchase } from '../../models/selectors'

import '../../style/purchase-receipt.css'


class PurchaseReceipt extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    this.props.selectPurchase(this.props.match.params.purchase_id)
  }

  renderUsersInformation() {
    return (
      <div>
        <div className="intro">
          Hi <strong>{this.props.purchase.buyer.fullname}</strong>,
          <br />
          This is the receipt for a payment of <strong>${this.props.purchase.amount}</strong> (USD) you made to {this.props.purchase.seller.fullname}.
        </div>

        <div className="payment-info">
          <div className="row">
            <div className="col-md-6">

            </div>
            <div className="col-md-6 text-md-right">
              <span>Payment Date</span>
              <div>
                <strong><Timestamp time={this.props.purchase.created_at} format='full' includeDay /></strong>
              </div>
            </div>
          </div>
        </div>

        <div className="payment-details">
          <div className="row">
            <div className="col-md-6">
              <span>Client</span>
              <strong>
                {this.props.purchase.buyer.fullname}
              </strong>
              <p>
                {this.props.purchase.buyer.address} <br />
                {this.props.purchase.buyer.us_state} <br />
                {this.props.purchase.buyer.postal_code} <br />
                {this.props.purchase.buyer.country} <br />
                <a href="#">
                  {this.props.purchase.buyer.email}
                </a>
              </p>
            </div>
            <div className="col-md-6 text-md-right">
              <span>Payment To</span>
              <strong>
                {this.props.purchase.seller.fullname}
              </strong>
              <p>
                {this.props.purchase.seller.address} <br />
                {this.props.purchase.seller.us_state} <br />
                {this.props.purchase.seller.postal_code} <br />
                {this.props.purchase.seller.country} <br />
                <a href="#">
                  {this.props.purchase.seller.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  renderItemInformation() {
    return (
      <div className="line-items">
        <div className="headers clearfix">
          <div className="row">
            <div className="col-4">Description</div>
            <div className="col-3">Quantity</div>
            <div className="col-5 text-right">Amount</div>
          </div>
        </div>
        <div className="items">
          <div className="row item">
            <div className="col-4 desc">
            <span className="name">
              <Link to={`/items/${this.props.purchase.item.id}`}> { this.props.purchase.item.name } </Link>
            </span>
            </div>
            <div className="col-3 qty">
              1
            </div>
            <div className="col-5 amount text-right">
              ${this.props.purchase.item.price}
            </div>
          </div>
        </div>
        <div className="total text-right">
          <p className="extra-notes">
            <strong>Extra Notes</strong>
            Please send all items at the same time to shipping address by next week.
            Thanks a lot.
          </p>
          <div className="field">
            Subtotal <span>${this.props.purchase.item.price}</span>
          </div>
          <div className="field">
            Shipping <span>${this.props.purchase.item.shipping_fee}</span>
          </div>
          <div className="field">
            Discount <span>{this.props.purchase.item.discount}%</span>
          </div>
          <div className="field grand-total">
            Total <span>{this.props.purchase.amount} ETH</span>
          </div>
        </div>

        <div className="print">
          <a href="#">
            Print this receipt
          </a>
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.purchase.id) {
      return <div>Loading..</div>
    }
    return (
      <div className="account-page">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item"><Link to="/">Home</Link></li>
            <li className="breadcrumb-item active">Order {this.props.purchase.id} Invoice</li>
          </ol>

          <div className="account-wrapper">
            <div className="invoice-wrapper">
              { this.renderUsersInformation() }
              { this.renderItemInformation() }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { purchase: purchase(state) }
}

export default connect(mapStateToProps, { selectPurchase })(PurchaseReceipt)
