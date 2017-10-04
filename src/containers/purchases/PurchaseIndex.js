import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import Timestamp from 'react-timestamp'

import '../../style/purchases-collection.css'

import { fetchAllPurchases } from '../../actions/actions_purchases'
import { cancelPurchase } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'

import { pendingPurchases, completedPurchases } from '../../models/selectors'

class PurchaseIndex extends Component {
  componentWillMount() {
    this.props.fetchAllPurchases(true)
  }

  renderPurchaseState(purchase) {
    switch(purchase.purchaseState) {
      case purchaseState.PENDING_CANCELLED:
        return <span className="badge badge-warning">Cancelling...</span>
      case purchaseState.PENDING_PURCHASED:
        return <span className="badge badge-warning">Purchasing...</span>
      case purchaseState.PURCHASED:
        return <span className="badge badge-warning">Wait for Shipping...</span>
      case purchaseState.SHIPPED:
        return <span className="badge badge-warning">Shipped</span>
      case purchaseState.COMPLETED:
        return <span className="badge badge-success">Delivered & Confirmed</span>
      case purchaseState.BUYER_CANCELLED:
        return <span className="badge badge-warning">Cancelled by Buyer</span>
      case purchaseState.SELLER_CANCELLED:
        return <span className="badge badge-warning">Cancelled by Seller</span>
      case purchaseState.SELLER_SHIPPING_TIMEOUT:
        return <span className="badge badge-warning">Cancelled (Not Shipped)</span>
      case purchaseState.BUYER_CONFIRMATION_TIMEOUT:
        return <span className="badge badge-success">Confirmed (Auto)</span>
      case purchaseState.ERROR:
        return <span className="badge badge-danger">Error</span>
      default:
        return <span></span>
    }
  }

  renderPurchaseAction(purchase) {
    switch(purchase.purchaseState) {
      case purchaseState.PENDING_PURCHASED:
      case purchaseState.PURCHASED:
        return (
          <td>
            <Link to={`/purchases/${purchase.id}/cancel`}>
              <button className="btn btn-outline-secondary btn-sm">Cancel</button>
            </Link>
          </td>
        )
      case purchaseState.SHIPPED:
        return (
          <td>
            <Link to={`/purchases/${purchase.id}/confirm`}>
              <button className="btn btn-outline-info btn-sm">Track Package</button>
            </Link>
            <Link to={`/purchases/${purchase.id}/confirm`}>
              <button className="btn btn-outline-success btn-sm">Confirm</button>
            </Link>
          </td>
        )
      default:
        return null
    }
  }

  renderTime(purchase) {
    const time = purchase.purchased_time || purchase.created_at
    return (
      <div>
        <Timestamp time={time} format='full' includeDay />
      </div>
    )
  }

  renderPurchases(isActive) {
    const _purchases = (isActive ? this.props.pendingPurchases : this.props.completedPurchases)
    let purchasesRows = _purchases.map((purchase) => {
      return (
        <tr key={purchase.id}>
          <td><Link to={`/purchases/${purchase.id}/receipt`}>{ purchase.id }</Link></td>
          <td>{ this.renderTime(purchase) }</td>
          <td>
            <Link to={`/items/${purchase.item.id}`} className="product-img">
              <img src={ purchase.item.picture } alt={ purchase.item.name } />
            </Link>
          </td>
          <td>{ purchase.amount } ETH</td>
          <td>{ this.renderPurchaseState(purchase) }</td>
          { isActive ? this.renderPurchaseAction(purchase) : null }
        </tr>
      )
    })

    return (
      <table className="table wishlist-table table-responsive">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Purchase Date</th>
            <th>Item</th>
            <th>Price</th>
            <th>Status</th>
            { isActive ? <th>Action</th> : null }
          </tr>
        </thead>
        <tbody>
          { purchasesRows }
        </tbody>
      </table>
    )
  }

  renderTabs() {
    return (
      <Tabs>
        <Tab label="Active Orders">
          <div className="tab-header clearfix">
            <h4 className="float-left">
              Active Orders
            </h4>
            <select className="custom-select float-right">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>All orders</option>
            </select>
          </div>
          { this.renderPurchases(true) }
        </Tab>
        <Tab label="Complete Orders">
          <div className="tab-header clearfix">
            <h4 className="float-left">
              Complete Orders
            </h4>
            <select className="custom-select float-right">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>All orders</option>
            </select>
          </div>
          { this.renderPurchases(false) }
        </Tab>
      </Tabs>
    )
  }

  render() {
    return (
      <div className="account-page">
        <div className="container">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Home</Link>
            </li>
            <li className="breadcrumb-item active">Order history</li>
          </ol>

          <div className="account-wrapper">
            { this.renderTabs() }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { pendingPurchases: pendingPurchases(state), completedPurchases: completedPurchases(state) }
}

export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(PurchaseIndex)
