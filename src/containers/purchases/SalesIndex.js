import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Tabs, Tab } from 'react-bootstrap-tabs'
import Timestamp from 'react-timestamp'

import '../../style/purchases-collection.css'

import { fetchAllPurchases } from '../../actions/actions_purchases'
import { cancelPurchase } from '../../actions/actions_contract'
import { purchaseState } from '../shared/PurchaseState'

import { pendingSales, completedSales } from '../../models/selectors'

class SalesIndex extends Component {
  componentWillMount() {
    if (this.props.provider.isConnected) {
      this.props.fetchAllPurchases(this.props.provider, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.isConnected && !this.props.provider.isConnected) {
      this.props.fetchAllPurchases(nextProps.provider, false)
    }
  }

  renderSaleState(sale) {
    switch(sale.purchaseState) {
      case purchaseState.PENDING_CANCELLED:
        return <span className="badge badge-warning">Cancelling...</span>
      case purchaseState.PENDING_PURCHASED:
        return <span className="badge badge-warning">Purchasing...</span>
      case purchaseState.PURCHASED:
        return <span className="badge badge-info">Wait for Shipping...</span>
      case purchaseState.SHIPPED:
        return <span className="badge badge-info">Shipped</span>
      case purchaseState.COMPLETED:
        return <span className="badge badge-success">Delivered & Confirmed</span>
      case purchaseState.BUYER_CANCELLED:
        return <span className="badge badge-warning">Cancelled</span>
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

  renderSaleAction(sale) {
    switch(sale.purchaseState) {
      case purchaseState.PURCHASED:
        return (
          <td>
            <Link to={`/purchases/${sale.id}/cancel`}>
              <button className="btn btn-outline-secondary btn-sm">Cancel</button>
            </Link>
            <Link to={`/purchases/${sale.id}/shipping`}>
              <button className="btn btn-outline-success btn-sm">Ship Item</button>
            </Link>
          </td>
        )
      default:
        return null
    }
  }

  renderTime(sale) {
    const time = sale.purchased_time || sale.created_at
    return (
      <div>
        <Timestamp time={time} format='full' includeDay />
      </div>
    )
  }

  renderSales(isActive) {
    const _sales = (isActive ? this.props.pendingSales : this.props.completedSales)
    let salesRows = _sales.map((sale) => {
      return (
        <tr key={sale.id}>
          <td>{ sale.id }</td>
          <td>{ this.renderTime(sale) }</td>
          <td>
            <Link to={`/items/${sale.item.id}`} className="product-img">
              <img src={ sale.item.picture } alt={ sale.item.name } />
            </Link>
          </td>
          <td>{ sale.amount } ETH</td>
          <td>{ this.renderSaleState(sale) }</td>
          { isActive ? this.renderSaleAction(sale) : null }
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
          { salesRows }
        </tbody>
      </table>
    )
  }

  renderTabs() {
    return (
      <Tabs>
        <Tab label="Active Sales">
          <div className="tab-header clearfix">
            <h4 className="float-left">
              Active Sales
            </h4>
            <select className="custom-select float-right">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>All sales</option>
            </select>
          </div>
          { this.renderSales(true) }
        </Tab>
        <Tab label="Complete Sales">
          <div className="tab-header clearfix">
            <h4 className="float-left">
              Complete Sales
            </h4>
            <select className="custom-select float-right">
              <option>Last 6 months</option>
              <option>Last 3 months</option>
              <option>All sales</option>
            </select>
          </div>
          { this.renderSales(false) }
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
            <li className="breadcrumb-item active">Sales history</li>
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
  return { pendingSales: pendingSales(state), completedSales: completedSales(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(SalesIndex)
