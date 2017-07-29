import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import Rating from 'react-rating'
import { Link } from 'react-router-dom'

import ReviewShow from '../reviews/ReviewShow'
import { fetchProvider } from '../../actions/actions_provider'
import { createPurchase } from '../../actions/actions_purchases'
import { selectItem } from '../../actions/actions_items'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, itemReviews } from '../../models/selectors'


class ItemShow extends Component {
  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.selectItem(this.props.provider, this.props.match.params.item_id)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.selectItem(nextProps.provider, this.props.match.params.item_id)
    }
  }

  purchaseItem(event) {
    event.preventDefault()
    this.props.createPurchase(this.props.item, this.props.provider, this.props.history)
  }

  renderReviews() {
    return (
      this.props.itemReviews.map(review => {
        return <ReviewShow key={review.id} review={review} />
      })
    )
  }

  renderRating() {
    return (
      <div>
        <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                        'fa fa-star-o fa-2x medium',
                        'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                  'fa fa-star fa-2x medium',
                  'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                fractions={2}
                initialRate={this.props.item.rating}
                readonly />
                ({ this.props.item.number_rating })

      </div>
    )
  }

  renderSalesNumber() {
    return (
      <div>
        { this.props.item.sales } sold
      </div>
    )
  }

  renderItem() {
    return (
      <div className='pure-g item-show'>
        <div className='pure-u-1 pure-u-md-2-3'>
          <h3 className='title'>{ this.props.item.name }</h3>
          <div className='title-divider'></div>
          <div className='item-show-picture'>
            <img src={ this.props.item.picture } alt={ this.props.item.name } />
          </div>
          <hr />
          <p className='item-show-seller'>Sell by
            <Link to={`/users/${this.props.item.user.wallet}/reviews`}>
              { this.props.item.user.fullname } ({ this.props.item.user.rating } from {this.props.item.user.number_reviews} reviews)
            </Link>
          </p>
          <p><strong>Description</strong></p>
          <p className='item-show-description'>{ this.props.item.description }</p>
          <p><strong>Reviews</strong></p>
          { this.renderReviews() }
        </div>
        <div className='pure-u-1 pure-u-md-1-3'>
          <div className='item-show-price'>
            { this.renderRating() }
            { this.renderSalesNumber() }
            Price : { this.props.item.price } ETH
          </div>
          <Button bsStyle="success" block onClick={(event) => this.purchaseItem(event)}><i className="fa fa-shopping-cart" aria-hidden="true"></i> BUY</Button>
        </div>
      </div>
    )
  }

  renderPendingPurchase() {
    return (
      <div className='pure-g item-pending-purchase'>
        <div className='pure-u-1'>
          <Spinner name="line-scale" color="coral" className='purchase-spinner' />
          <p>Waiting for payment transaction to be processed...</p>
          <p className="text-danger"><i className="fa fa-exclamation-circle" aria-hidden="true"></i> Do not close the window.</p>
        </div>
      </div>
    )
  }

  renderByPendingState() {
    if (!this.props.purchase.purchaseState) {
      return this.renderItem()
    }
    switch(this.props.purchase.purchaseState) {
      case purchaseState.NEW:
        return this.renderItem()
      case purchaseState.PENDING_PURCHASED:
        return this.renderPendingPurchase()
      case purchaseState.ERROR:
        return <div>ERROR : Payment transactions failed</div>
      default:
        return this.renderItem()
    }
  }

  render() {
    if (!this.props.item.name) {
      return <div>Loading..</div>
    }
    return (
      <div>
        { this.renderByPendingState() }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item : item(state), provider: state.provider, purchase: purchase(state), itemReviews: itemReviews(state) }
}

export default connect(mapStateToProps, { selectItem, createPurchase, fetchProvider })(ItemShow)
