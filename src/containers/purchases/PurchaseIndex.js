import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Panel, Button } from 'react-bootstrap'
import Timestamp from 'react-timestamp'

import '../../style/purchases-collection.css'

import { fetchAllPurchases } from '../../actions/actions_purchases'
import { cancelPurchase } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'

import { pendingPurchases, completedPurchases } from '../../models/selectors'

class PurchaseIndex extends Component {
  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.fetchAllPurchases(this.props.provider, true)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchAllPurchases(nextProps.provider, true)
    }
  }

  renderPurchasesActions(purchase) {
    switch(purchase.purchaseState) {
      case purchaseState.PENDING_CANCELLED:
        return  <Button bsSize="small" block disabled>Pending Cancel</Button>
      case purchaseState.PENDING_PURCHASED:
        return  <Button bsSize="small" block disabled>Pending Transaction</Button>
      case purchaseState.PURCHASED:
        return (
          <div>
            <Button bsSize="small" block disabled>Awaiting Shipping</Button>
            <Button bsSize='small' block onClick={() => this.props.cancelPurchase(purchase.id, this.props.provider)}>Cancel Purchase</Button>
          </div>
        )
      case purchaseState.SHIPPED:
        return (
          <div>
            <Link to={`/purchases/confirmation/${purchase.id}`}><Button bsSize="small" block>Confirm Purchase</Button></Link>
            <Button bsSize="small" block>Track Package</Button>
          </div>
          )
      case purchaseState.COMPLETED:
        return <Button bsSize="small" block disabled>Purchase Complete</Button>
      case purchaseState.BUYER_CANCELLED:
        return <Button bsSize="small" block disabled>Purchase Cancelled By Buyer</Button>
      case purchaseState.SELLER_CANCELLED:
        return <Button bsSize="small" block disabled>Purchase Cancelled By Seller</Button>
      case purchaseState.SELLER_SHIPPING_TIMEOUT:
        return <Button bsSize="small" block disabled>Shipping Timeout</Button>
      case purchaseState.BUYER_CONFIRMATION_TIMEOUT:
        return <Button bsSize="small" block disabled>Confirmation Timeout</Button>
      case purchaseState.ERROR:
        return <Button bsSize="small" block disabled>Transaction Error</Button>
      default:
        return <div></div>
    }
  }

  renderTime(label, time) {
    if (time == 0) {
      return <div></div>
    }
    return (
      <div>
        {label} : <Timestamp time={time} format='full' includeDay />
      </div>
    )
  }

  renderPurchases(isActive) {
    const _purchases = (isActive ? this.props.pendingPurchases : this.props.completedPurchases)
    let purchasesRows = _purchases.map((purchase) => {
      return (
        <tr key={purchase.id}>
          <td>{ purchase.id }</td>
          <td>{ this.renderTime('Purchased', purchase.purchased_time) }</td>
          <td>
            <a href="product.html" className="product-img">
              <img src={ purchase.item.picture } alt={ purchase.item.name } />
            </a>
          </td>
          <td>{ purchase.amount } ETH</td>
          <td><span className="badge badge-success">Delivered</span></td>
        </tr>
      )
    })

    return (
      <table className="table wishlist-table table-responsive">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Item</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          { purchasesRows }
        </tbody>
      </table>
    )
  }

  render() {
    return (
      <div className="account-page">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <a href="#">Home</a>
            </li>
            <li className="breadcrumb-item active">Order history</li>
          </ol>

          <div className="account-wrapper">
            <ul className="nav nav-tabs" role="tablist">
              <li role="presentation" className="nav-item">
                <a className="nav-link active" href="account-orders.html" role="tab">Active Order</a>
              </li>
              <li role="presentation" className="nav-item">
                <a className="nav-link" href="account-wishlist.html" role="tab">Complete Order</a>
              </li>
            </ul>

            <div className="tab-content">
              <div role="tabpanel" className="tab-pane active" id="orders">
                <div className="tab-header clearfix">
                  <h4 className="float-left">
                    Orders last 6 months
                  </h4>
                  <select className="custom-select float-right">
                    <option>Last 6 months</option>
                    <option>Last 3 months</option>
                    <option>All orders</option>
                  </select>
                </div>
                { this.renderPurchases(false) }
              </div>
            </div>
          </div>
        </div>
      </div>

    )
  }
}

function mapStateToProps(state) {
  return { pendingPurchases: pendingPurchases(state), completedPurchases: completedPurchases(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(PurchaseIndex)
