import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import Rating from 'react-rating'
import { Link } from 'react-router-dom'

import ReviewShow from '../reviews/ReviewShow'
import { createPurchase } from '../../actions/actions_purchases'
import { selectItem } from '../../actions/actions_items'
import { purchaseState } from '../shared/PurchaseState'
import { item, purchase, itemReviews } from '../../models/selectors'

import '../../style/item.css'


class ItemShow extends Component {
  constructor(props) {
    super(props)

    this.state = {
      finalPrice: 0.0
    }
  }

  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.selectItem(this.props.provider, this.props.match.params.item_id).then((request) => {
        this.setFinalPrice()
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.selectItem(nextProps.provider, this.props.match.params.item_id).then((request) => {
        this.setFinalPrice()
      })
    }
  }

  setFinalPrice() {
    var finalPrice = 0
    if (this.props.item.discount === 0) {
      finalPrice = this.props.item.price + this.props.item.shipping_fee
    } else {
      finalPrice = this.props.item.price * (this.props.item.discount / 100) + this.props.item.shipping_fee
    }

    this.setState({finalPrice: finalPrice})
  }

  purchaseItem(event) {
    event.preventDefault()
    this.props.createPurchase(this.props.item, this.state.finalPrice, this.props.provider, this.props.history)
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

  renderFinalPrice() {
    return (
      <div>Total : { this.state.finalPrice } ETH</div>
    )
  }

  renderShippingFee() {
    return (
      <div>Shipping Fee : { this.props.item.shipping_fee } ETH</div>
    )
  }

  renderItemPrice() {
    if (!this.props.item.discount || this.props.item.discount === 0) {
      return <div className="price">{ this.props.item.price } ETH</div>
    }
    const discountedPrice = this.props.item.price * (this.props.item.discount / 100)
    return (
      <div className="price">
        { discountedPrice } ETH

        <div className="compare-at-price">
          { this.props.item.price } ETH
        </div>
      </div>
    )
  }

  renderShippingDeadline() {
    return (
      <div>Guarantee Shipping in { this.props.item.shipping_deadline } days or get refunded</div>
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
            { this.renderItemPrice() }
            { this.renderShippingFee() }
            { this.renderFinalPrice() }
            <hr/>
            { this.renderShippingDeadline() }
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

  renderPanels() {
    return (
      <div className="description">
        <ul className="nav nav-tabs" role="tablist">
          <li className="nav-item">
            <a className="nav-link active" href="#description" role="tab" data-toggle="tab">Description</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#details" role="tab" data-toggle="tab">Details</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#requirements" role="tab" data-toggle="tab">Requirements</a>
          </li>
        </ul>

        <div className="tab-content">
          <div role="tabpanel" className="tab-pane active" id="description">
            <p> { this.props.item.description } </p>
          </div>
          <div role="tabpanel" className="tab-pane" id="details">
            <p> { this.props.item.short_description } </p>
          </div>
          <div role="tabpanel" className="tab-pane" id="requirements">
            <p> { this.props.item.description } </p>
          </div>
        </div>
      </div>
    )
  }

  renderInfos() {
    return (
      <div className="col-md-6 info">
        <div className="share">
          <a href="#" data-toggle="tooltip" title="Share on Twitter">
            <i className="fa fa-twitter"></i>
          </a>
          <a href="#" data-toggle="tooltip" title="Share on Facebook">
            <i className="fa fa-facebook"></i>
          </a>
          <a href="#" data-toggle="tooltip" title="Share on Pinterest">
            <i className="fa fa-pinterest"></i>
          </a>
          <a href="#" data-toggle="tooltip" title="Share on Google Plus">
            <i className="fa fa-google-plus"></i>
          </a>
        </div>
        <div className="name">
          { this.props.item.name }
        </div>
        <div className="rating">
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star"></i>
          <i className="fa fa-star-half-o"></i>
        </div>
        { this.renderItemPrice() }

        { this.renderPanels() }

        <form action="#">
          <div className="variants">
            <div className="variant">
              <label className="label-variant-colors">
                Color:
              </label>
              <div className="variant-colors">
                <div className="variant-color variant-color--grey">
                </div>
                <div className="variant-color variant-color--blue">
                </div>
                <div className="variant-color variant-color--black selected">
                </div>
              </div>
            </div>
            <div className="variant">
              <label>Size: </label>
              <select className="spacial-select">
                <option>Large</option>
                <option>Medium</option>
                <option>Small</option>
                <option>Mini</option>
              </select>
            </div>
            <div className="variant">
              <label>Quantity: </label>
              <input type="number" min="1" max="99" value="1" className="form-control input-qty" />
            </div>
          </div>

          <div className="add-to-cart">
            <button type="submit" className="btn-shadow btn-shadow-dark">
              <i className="ion-plus"></i> Buy
            </button>
          </div>
        </form>
      </div>
    )
  }

  renderPictures() {
    return (
      <div className="col-md-6">
        <a href={ this.props.item.picture } className="popup-thumb main-pic" style={ {backgroundImage: `url(${this.props.item.picture})`} }>
        </a>
        <div className="thumbs">
          <a href={ this.props.item.picture } className="popup-thumb thumb" style={ {backgroundImage: `url(${this.props.item.picture})`} }>
            <div className="mask">
              <i className="fa fa-search"></i>
            </div>
          </a>
          <a href={ this.props.item.picture } className="popup-thumb thumb" style={ {backgroundImage: `url(${this.props.item.picture})`} }>
            <div className="mask">
              <i className="fa fa-search"></i>
            </div>
          </a>
          <a href={ this.props.item.picture } className="popup-thumb thumb" style={ {backgroundImage: `url(${this.props.item.picture})`} }>
            <div className="mask">
              <i className="fa fa-search"></i>
            </div>
          </a>
          <a href={ this.props.item.picture } className="popup-thumb thumb" style={ {backgroundImage: `url(${this.props.item.picture})`} }>
            <div className="mask">
              <i className="fa fa-search"></i>
            </div>
          </a>
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.item.name) {
      return <div>Loading..</div>
    }
    return (
      <div>
        <div className="store-filters">
          <div className="container clearfix">
            <ol className="breadcrumb">
              <li className="breadcrumb-item"><a href="#">Home</a></li>
              <li className="breadcrumb-item"><a href="#">Collection for Women</a></li>
              <li className="breadcrumb-item active">{ this.props.item.name }</li>
            </ol>
          </div>
        </div>

        <div className="store-product-details">
          <div className="container">
            <div className="row">
              { this.renderPictures() }
              { this.renderInfos() }
            </div>
          </div>
        </div>

      </div>
    )
  }
}

function mapStateToProps(state) {
  return { item : item(state), provider: state.provider, purchase: purchase(state), itemReviews: itemReviews(state) }
}

export default connect(mapStateToProps, { selectItem, createPurchase })(ItemShow)
