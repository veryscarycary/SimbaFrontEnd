import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Panel, Button } from 'react-bootstrap'
import Timestamp from 'react-timestamp'

import '../../style/purchase.css'

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

  renderPurchases(isPending) {
    const _purchases = (isPending ? this.props.pendingPurchases : this.props.completedPurchases)
    let purchases = _purchases.map((purchase) => {
      return (
        <Panel key={purchase.id} header={`Order ${purchase.id}`}>
          <div className='pure-g one-purchase'>
            <div className='pure-u-1 pure-u-md-1-5'>
              <Link to={`/items/${purchase.item.id}`}><img src={purchase.item.picture} alt={purchase.item.name} /></Link>
            </div>
            <div className='pure-u-1 pure-u-md-3-5'>
              <Link to={`/items/${purchase.item.id}`}>{ purchase.item.name }</Link> <br/>
              <strong>Guarantee Shipping Before : <Timestamp time={purchase.shipping_deadline} format='date' includeDay /></strong><br />
              { purchase.item.short_description }<br/>
              <span className='text-danger'><strong>{ purchase.amount } ETH</strong></span>
              <hr/>
              <div>
                <strong>History</strong><br/>
                { this.renderTime('Purchased', purchase.purchased_time) }
                { this.renderTime('Shipped', purchase.shipped_time) }
                { this.renderTime('Cancelled', purchase.cancel_time) }
                { this.renderTime('Timeout', purchase.timeout_time) }
                { this.renderTime('Completed', purchase.completed_time) }
              </div>
            </div>
            <div className='pure-u-1 pure-u-md-1-5'>
              { this.renderPurchasesActions(purchase) }
            </div>
          </div>
        </Panel>
      )
    })

    return purchases
  }

  render() {
    return (
      <div className="pure-g list-purchases">
        <div className='pure-u-1'>
          <ul>
            <h3 className='title'>Pending Purchases</h3>
            <div className='title-divider'></div>
            { this.props.pendingPurchases ? this.renderPurchases(true) : '' }
            <hr/>
            <h3 className='title'>Finalized Purchases</h3>
            <div className='title-divider'></div>
            { this.props.completedPurchases ? this.renderPurchases(false) : '' }
          </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { pendingPurchases: pendingPurchases(state), completedPurchases: completedPurchases(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(PurchaseIndex)
