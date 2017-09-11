import React, { Component } from 'react'
import { connect } from 'react-redux'

import { fetchPurchase } from '../../actions/actions_purchases'
import { purchase } from '../../models/selectors'

class PurchaseInitialize extends Component {
  componentWillMount() {
    if (this.props.purchaseId) {
      this.props.fetchPurchase(this.props.purchaseId)
    } else {
      this.props.fetchPurchase(this.props.match.params.purchase_id)
    }
  }

  render() {
    if (!this.props.purchase.buyer) {
      return <div></div>
    }
    return (
      <div className="pure-g purchase">
        <div className='pure-u-1'>
          <p>Thank you for order! We have provided your order information below, but you can also track on your order here. </p>
        </div>
        <hr />
        <div className='pure-u-1 pure-u-md-1-2'>
          <h3>Shipping Details</h3>
          Ship to :
          <p>
            { this.props.purchase.buyer.fullname }<br/>
            { this.props.purchase.address }<br />
            { this.props.purchase.city }, { this.props.purchase.us_state }, { this.props.purchase.postal_code }<br/>
            { this.props.purchase.country }
          </p>
        </div>
        <div className='pure-u-1 pure-u-md-1-2'>
          <h3>Item Details</h3>
          <p>Date : { this.props.purchase.created_at }</p>
          Price : { this.props.purchase.item.price } ETH<br/>
          <img className='purchase-confirmation-img' src={ this.props.purchase.item.picture } alt={ this.props.purchase.item.name } />
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { purchase: purchase(state) }
}

export default connect(mapStateToProps, { fetchPurchase })(PurchaseInitialize)
