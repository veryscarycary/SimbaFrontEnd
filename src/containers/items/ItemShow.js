import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button } from 'react-bootstrap'
import Spinner from 'react-spinkit'
import Rating from 'react-rating'
import { Link } from 'react-router-dom'

import ReviewShow from '../reviews/ReviewShow'
import { selectItem } from '../../actions/actions_items'
import { item, itemReviews } from '../../models/selectors'

import '../../style/item.css'


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

  // renderReviews() {
  //   return (
  //     this.props.itemReviews.map(review => {
  //       return <ReviewShow key={review.id} review={review} />
  //     })
  //   )
  // }

  renderRating() {
    return (
      <div className="rating">
        <Rating empty={['fa fa-star-o low', 'fa fa-star-o low',
                        'fa fa-star-o medium',
                        'fa fa-star-o high', 'fa fa-star-o high']}
                full={['fa fa-star low', 'fa fa-star low',
                  'fa fa-star medium',
                  'fa fa-star high', 'fa fa-star high']}
                fractions={2}
                initialRate={this.props.item.rating}
                readonly />
        ({ this.props.item.number_rating })
      </div>
    )
  }

  // renderSalesNumber() {
  //   return (
  //     <div>
  //       { this.props.item.sales } sold
  //     </div>
  //   )
  // }

  renderItemPrice() {
    if (!this.props.item.discount || this.props.item.discount === 0) {
      return <div className="price">{ this.props.item.price } ETH</div>
    }
    const discountedPrice = this.props.item.price - this.props.item.price * (this.props.item.discount / 100)
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

  renderSocialMedia() {
    return (
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
    )
  }

  renderInfos() {
    return (
      <div className="col-md-6 info">
        { this.renderSocialMedia() }
        <div className="name">
          { this.props.item.name }
        </div>
        { this.renderRating() }
        <div className="details">
          <span className="variant">
            Guarantee shipping within { this.props.item.shipping_deadline } days
          </span>
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
              <input type="number" min="1" max="99" className="form-control input-qty" />
            </div>
          </div>

          <div className="add-to-cart">
            <Link to={`/items/${this.props.item.id}/checkout`}>
              <button type="submit" className="btn-shadow btn-shadow-dark">
                Shipping & Payment <i className="ion-chevron-right"></i>
              </button>
            </Link>
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
      return (
        <div className="store-filters">
          <div className="container clearfix">
            <Spinner name="line-scale" color="coral" className='purchase-spinner' />
          </div>
        </div>
      )
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
  return { item : item(state), provider: state.provider, itemReviews: itemReviews(state) }
}

export default connect(mapStateToProps, { selectItem })(ItemShow)
