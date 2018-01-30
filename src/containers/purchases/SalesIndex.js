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
    this.props.fetchAllPurchases(false)
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
        return <span className="badge badge-info">Waiting for Confirmation...</span>
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

  renderChat() {
    return (
      <div>
        <img
          style={{height: "30px"}}
          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAuIwAALiMBeKU/dgAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANJSURBVHic7d09bE5RHMfxL9VKaCQUA2JoQ4jFQG0SVoNFmQwSiU4S0rCgi62xEIlFSOhAIiQGqXgZiEoYhAGJxUuUlNZAKIrhimrSe+7znHuee/699/dJTjrc2/85Ob/nvg7ngoiIiIiIiIhUxzrgHDAEfAZ+V6iNASPATWAnMDPnXOYyAzgK/CL+xFhpd4C2PJOax6EaBljFNgjMdk1cU+bU1m890E9ylMhky/7+vV1kp2eJ/0u03D4Cs9ImrxEXmk0NqFkmC4C1aRtTk8rhLtDcgLpWtACLgeXAUs8aS8INR/7XDuwjua2v57TVFWOwVdIKnECBmLOb2p69FEiBelEgpjQBj/AMJOr7lZIaBw76/nM9t72LgG1AJ8ltX4tvp9PQF+AlcAO4BvzM2P868IaJJ/Pgeqje29q09hTYUMOcnXLUyHXKOgb0AXNr2LcKVgG3gI0Z+73wKZ4VyA5gv0/hkpsDXALmO/YZ8imcFUivT9GKWAjsdWz/7lPUFchKYLVP0QrZGrqgK5CO0J2V0IrQBV2BtIburISCz5EeDI1RIMYoEGMUiDEKxBgFYowCMUaBGKNAjFEgxigQYxSIMQrEGAVijAIxRoEYo0CMUSDGKBBjFIgxCsQYBWKMAjFGgRijQIxRIMYoEGMUiDEKxBgFYowCMUaBGKNA4hhL26BA4nibtkGBFG+YZC2UKSmQ4vXhWJpDgRTrPnDctYMCKc4AsAXHBR0aswimTHgPPCBZx/gCycIz3rqIv/LOdGhB6ZRljAIxRoEYo0CMUSDGuAIJfgdRQoXeZX0I3VkJDYcu6ArkMfAjdIcl8zB0QVcgI8CV0B2WzOmiO+wAPhH/adhiGyDSZ502A6N1DrbsbZDkSznRtAOXSa4psScjZhsBjpDxpbU86j3k5gFrqH2V68NkrwA9lTFgFw24i8nhHcky4+OxB5LHRfx+iXtiDLYKfAI5H2WkRlh7dfIM6I49iJgsBfIV2E7yWYzKshRID/Ak9iDKrtZrSH+sAVpj4Qh5ju6q/okdyDd03ZgkdiAHSN4qS0HOkH7duIq+uV64bqYO4xXQFnFcldUM3GNyGKPAupiDsqyIU0YLyZHSCbwGTpJ8dFFERKa3P7fqGl2J0iOtAAAAAElFTkSuQmCC" alt="chat" />
      </div>
    )
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
          <td>${ sale.amount }</td>
          <td>{ this.renderSaleState(sale) }</td>
          { isActive ? this.renderSaleAction(sale) : null }
          <td>{ this.renderChat() }</td>
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
  return { pendingSales: pendingSales(state), completedSales: completedSales(state) }
}

export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(SalesIndex)
