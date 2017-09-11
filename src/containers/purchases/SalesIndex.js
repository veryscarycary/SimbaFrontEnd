import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Panel, Button } from 'react-bootstrap'
import Timestamp from 'react-timestamp'

import { cancelPurchase } from '../../actions/actions_contract'
import { fetchAllPurchases } from '../../actions/actions_purchases'
import { purchaseState } from '../shared/PurchaseState'

import { pendingSales, completedSales } from '../../models/selectors'

class SalesIndex extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: ''
    }
  }

  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.fetchAllPurchases(this.props.provider, false)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchAllPurchases(nextProps.provider, false)
    }
  }

  renderPurchasesActions(purchase) {
    switch(purchase.purchaseState) {
      case purchaseState.PENDING_CANCELLED:
        return <Button bsSize="small" block disabled>Pending Cancel</Button>
      case purchaseState.PENDING_PURCHASED:
        return <Button bsSize="small" block disabled>Pending Transaction</Button>
      case purchaseState.PENDING_SHIPPED:
        return <Button bsSize="small" block disabled>Pending Shipping</Button>
      case purchaseState.PURCHASED:
        return (
          <div>
            <Link to={`/purchases/shipping/${purchase.id}`}><Button bsSize="small" block>Send Tracking Number</Button></Link>
            <Button bsSize='small' block onClick={() => this.props.cancelPurchase(purchase.id, this.props.provider)}>Cancel Transaction</Button>
          </div>
          )
      case purchaseState.SHIPPED:
        return <Button bsSize="small" block disabled>Awaiting Confirmation</Button>
      case purchaseState.COMPLETED:
        return <Button bsSize="small" block disabled>Sales Complete</Button>
      case purchaseState.ERROR:
        return <Button bsSize="small" block disabled>Transaction Error</Button>
      case purchaseState.BUYER_CANCELLED:
        return <Button bsSize="small" block disabled>Purchase Cancelled By Buyer</Button>
      case purchaseState.SELLER_CANCELLED:
        return <Button bsSize="small" block disabled>Purchase Cancelled By Seller</Button>
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
    const _purchases = (isPending ? this.props.pendingSales : this.props.completedSales)
    let purchases = _purchases.map((purchase) => {
      return (
        <div key={purchase.id}>
          {
            purchase.purchaseState !== purchaseState.ERROR ? (
              <Panel header={`Order ${purchase.id}`}>
                <div className='pure-g one-purchase'>
                  <div className='pure-u-1 pure-u-md-1-5'>
                    <Link to={`/items/${purchase.item.id}`}><img src={purchase.item.picture} alt={purchase.item.name} /></Link>
                  </div>
                  <div className='pure-u-1 pure-u-md-3-5'>
                    <Link to={`/items/${purchase.item.id}`}>{ purchase.item.name }</Link> <br/>
                    <strong>Ship Before : <Timestamp time={purchase.shipping_deadline} format='full' includeDay /></strong><br />
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
              ) : null
          }
        </div>
      )
    })

    return purchases
  }

  render() {
    return (
      <div className="pure-g list-purchases">
        <div className='pure-u-1'>
          <ul>
            <h3 className='title'>Pending Sales</h3>
            <div className='title-divider'></div>
            { this.props.pendingSales ? this.renderPurchases(true) : '' }
            <hr/>
            <h3 className='title'>Finalized Sales</h3>
            <div className='title-divider'></div>
            { this.props.completedSales ? this.renderPurchases(false) : '' }
          </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { pendingSales: pendingSales(state), completedSales: completedSales(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchAllPurchases, cancelPurchase })(SalesIndex)
