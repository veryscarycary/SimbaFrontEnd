import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { selectPurchase } from '../../actions/actions_purchases'
import { purchase } from '../../models/selectors'

import '../../style/purchase-receipt.css'


class PurchaseReceipt extends Component {
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

  renderUsersInformation() {
    return (
      <div>
        <div className="intro">
          Hi <strong>John McClane</strong>,
          <br />
          This is the receipt for a payment of <strong>$312.00</strong> (USD) you made to Spacial Themes.
        </div>

        <div className="payment-info">
          <div className="row">
            <div className="col-md-6">
              <span>Payment No.</span>
              <strong>883053045</strong>
            </div>
            <div className="col-md-6 text-md-right">
              <span>Payment Date</span>
              <strong>Feb 09, 2018 - 03:44 pm</strong>
            </div>
          </div>
        </div>

        <div className="payment-details">
          <div className="row">
            <div className="col-md-6">
              <span>Client</span>
              <strong>
                John McClane
              </strong>
              <p>
                989 5th Avenue <br />
                New York City <br />
                55839 <br />
                USA <br />
                <a href="#">
                  john.mcclane@gmail.com
                </a>
              </p>
            </div>
            <div className="col-md-6 text-md-right">
              <span>Payment To</span>
              <strong>
                Spacial Themes LLC
              </strong>
              <p>
                344 9th Avenue <br />
                San Francisco <br />
                99383 <br />
                USA <br />
                <a href="#">
                  spacial.themes@gmail.com
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
              Spacial Theme Customization
            </div>
            <div className="col-3 qty">
              3
            </div>
            <div className="col-5 amount text-right">
              $60.00
            </div>
          </div>
          <div className="row item">
            <div className="col-4 desc">
              About us Page
            </div>
            <div className="col-3 qty">
              1
            </div>
            <div className="col-5 amount text-right">
              $20.00
            </div>
          </div>
          <div className="row item">
            <div className="col-4 desc">
              Landing Web Design
            </div>
            <div className="col-3 qty">
              2
            </div>
            <div className="col-5 amount text-right">
              $18.00
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
            Subtotal <span>$379.00</span>
          </div>
          <div className="field">
            Shipping <span>$0.00</span>
          </div>
          <div className="field">
            Discount <span>4.5%</span>
          </div>
          <div className="field grand-total">
            Total <span>$312.00</span>
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
  return { provider: state.provider, purchase: purchase(state) }
}

export default connect(mapStateToProps, { selectPurchase })(PurchaseReceipt)
