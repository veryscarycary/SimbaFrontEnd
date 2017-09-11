import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Textarea } from 'formsy-react-components'
import { Button, ControlLabel } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import Rating from 'react-rating'

import { purchaseState } from '../shared/PurchaseState'
import { fetchPurchase } from '../../actions/actions_purchases'
import { createReview } from '../../actions/actions_reviews'
import { purchase } from '../../models/selectors'

class PurchaseConfirmation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      seller_review: '',
      item_review: '',
      seller_rating: 5,
      item_rating: 5
    }
  }

  componentWillMount() {
    this.props.fetchPurchase(this.props.match.params.purchase_id)
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.createReview(this.props.purchase, this.state, this.props.provider)
  }

  renderPendingConfirmationPage() {
    return (
      <div className='pure-g item-pending-purchase'>
        <div className='pure-u-1'>
          <Spinner name="line-scale" color="coral" className='purchase-spinner' />
          <p>Waiting for purchase confirmation transaction to be processed...</p>
          <p className="text-danger"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Do not close the window.</p>
        </div>
      </div>
    )
  }

  renderConfirmationCompletePage() {
    return (
      <div className="pure-g purchase">
        <div className='pure-u-1'>
          <p>Thank you for confirming the purchase transactions. Your review and ratings have been sent to the seller. </p>
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

  renderConfirmationPage() {
    return (
      <div className="pure-g purchase">
        <div className='pure-u-1 pure-u-md-1-3'>
          <h3>Item Details</h3>
          <img className='purchase-confirmation-img' src={ this.props.purchase.item.picture } alt={ this.props.purchase.item.name } />
          <h3>Shipping Details</h3>
          Ship to :
          <p>
            { this.props.purchase.buyer.fullname }<br/>
            { this.props.purchase.address }<br />
            { this.props.purchase.city }, { this.props.purchase.us_state }, { this.props.purchase.postal_code }<br/>
            { this.props.purchase.country }
          </p>
        </div>
        <div className='pure-u-1 pure-u-md-2-3'>
          <h3>Confirm Purchase & Leave a review</h3>
          <Form layout='vertical' onValidSubmit={this.submit.bind(this)} >
            <Textarea
              label='Seller Review'
              value={this.state.seller_review}
              name='seller_review'
              type='text'
              placeholder='Seller Review'
              onChange={this.handleChange.bind(this)}
              rows={3} />

            <ControlLabel>Seller Rating</ControlLabel><br/>
            <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                      'fa fa-star-o fa-2x medium',
                      'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                    full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                      'fa fa-star fa-2x medium',
                      'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                    initialRate={this.state.seller_rating}
                    onChange={(rate) => this.setState({seller_rating: rate})} />
            <Textarea
              label='Item Review'
              value={this.state.item_review}
              name='item_review'
              type='text'
              placeholder='Item Review'
              onChange={this.handleChange.bind(this)}
              rows={3} />

            <ControlLabel>Item Rating</ControlLabel><br/>
            <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                      'fa fa-star-o fa-2x medium',
                      'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                    full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                      'fa fa-star fa-2x medium',
                      'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                    initialRate={this.state.item_rating}
                    onChange={(rate) => this.setState({item_rating: rate})} />
            <Button bsSize="small" bsStyle="primary" block type='submit'>Confirm Purchase</Button>
          </Form>
        </div>
      </div>
    )
  }

  renderByShippingState() {
    switch(this.props.purchase.purchaseState) {
      case purchaseState.PENDING_COMPLETED:
        return this.renderPendingConfirmationPage()
      case purchaseState.COMPLETED:
        return this.renderConfirmationCompletePage()
      case purchaseState.ERROR:
        return <div>ERROR : Payment transactions failed</div>
      default:
        return this.renderConfirmationPage()
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

export default connect(mapStateToProps, { fetchPurchase, createReview })(PurchaseConfirmation)
