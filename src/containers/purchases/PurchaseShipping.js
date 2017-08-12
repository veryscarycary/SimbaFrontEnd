import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input } from 'formsy-react-components'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'

import '../../style/purchase.css'

import { purchaseState } from '../shared/PurchaseState'
import { fetchPurchase } from '../../actions/actions_purchases'
import { sendCode } from '../../actions/actions_contract'

import { purchase } from '../../models/selectors'

class PurchaseShipping extends Component {
  constructor(props) {
    super(props)

    this.state = {
      code: ''
    }
  }

  componentWillMount() {
    this.props.fetchPurchase(this.props.match.params.purchase_id)
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    console.log('submit')
    this.props.sendCode(this.props.purchase.id, this.state.code, this.props.provider)
  }

  renderPendingShippingPage() {
    return (
      <div className='pure-g item-pending-purchase'>
        <div className='pure-u-1'>
          <Spinner name="line-scale" color="coral" className='purchase-spinner' />
          <p>Waiting for shipping transaction to be processed...</p>
          <p className="text-danger"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Do not close the window.</p>
        </div>
      </div>
    )
  }

  renderShippingCompletePage() {
    return (
      <div className="pure-g purchase">
        <div className='pure-u-1'>
          <p>Shipping Transaction is complete! You have succesfully sent the tracking number.</p>
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

  renderShippingPage() {
    return (
      <div className="pure-g purchase">
        <div className='pure-u-1 pure-u-md-1-3'>
          <h3>Item Details</h3>
          <img className='purchase-confirmation-img' src={ this.props.purchase.item.picture } alt={ this.props.purchase.item.name } />
        </div>
        <div className='pure-u-1 pure-u-md-1-3'>
          <h3>Shipping Details</h3>
          Ship to :
          <p>
            { this.props.purchase.buyer.fullname }<br/>
            { this.props.purchase.address }<br />
            { this.props.purchase.city }, { this.props.purchase.us_state }, { this.props.purchase.postal_code }<br/>
            { this.props.purchase.country }
          </p>
        </div>
        <div className='pure-u-1 pure-u-md-1-3'>
          <h3>Send Code</h3>
          <Form layout='elementOnly' onValidSubmit={this.submit.bind(this)} >
            <Input
              value={this.state.code}
              name='code'
              type='text'
              placeholder='Tracking Number'
              onChange={this.handleChange.bind(this)}
              required />
            <Button bsSize="small" bsStyle="primary" block type='submit'>Send Tracking Number</Button>
          </Form>
        </div>
      </div>
    )
  }

  renderByShippingState() {
    switch(this.props.purchase.purchaseState) {
      case purchaseState.PENDING_SHIPPED:
        return this.renderPendingShippingPage()
      case purchaseState.SHIPPED:
        return this.renderShippingCompletePage()
      case purchaseState.ERROR:
        return <div>ERROR : Payment transactions failed</div>
      default:
        return this.renderShippingPage()
    }
  }

  render() {
    if (!this.props.purchase.buyer) {
      return <div></div>
    }
    return (
      <div>
        { this.renderByShippingState() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { purchase: purchase(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchPurchase, sendCode })(PurchaseShipping)
