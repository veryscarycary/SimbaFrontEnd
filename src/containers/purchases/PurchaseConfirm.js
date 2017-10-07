import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Form, Textarea } from 'formsy-react-components'
import Rating from 'react-rating'

import PurchaseSummary from '../purchases/PurchaseSummary'

import { selectPurchase } from '../../actions/actions_purchases'
import { createReview } from '../../actions/actions_reviews'
import { purchaseState } from '../shared/PurchaseState'
import { purchase } from '../../models/selectors'
import withTransactionWatcher from '../../containers/eth/withTransactionWatcher'

import '../../style/purchase-confirm.css'

class PurchaseConfirm extends Component {
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
    this.props.selectPurchase(this.props.match.params.purchase_id)
  }

  renderPurchaseConfirmation() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-checkmark-outline"></i>
              <h1>
                Thank you for confirming the reception of {this.props.purchase.item.name} (Order {this.props.purchase.id}).
              </h1>
            </header>
            <p>
              Your reviews and ratings have been sent out to the seller.
            </p>
            <Link to='/'>
              Go back to Home Page
            </Link>
          </div>
        </section>
      </div>
    )
  }

  renderConfirmationError() {
    return (
      <div className="col-md-6">
        <section>
          <div id="checkout-order-done">
            <header>
              <i className="ion-ios-close-outline"></i>
              <h1>
                An error occured. Confirmation of Order {this.props.purchase.id} failed.
              </h1>
            </header>
            <p>
              Please contact us at support@simba.market if this error persists.
            </p>
            <a href="#" onClick={() => window.location.reload()}>
              Go back to Shipping Page
            </a>
          </div>
        </section>
      </div>
    )
  }

  renderFormOrConfirmation() {
    if (!this.props.purchase.purchaseState) {
      return this.renderRatingForm()
    }
    switch(this.props.purchase.purchaseState) {
      case purchaseState.COMPLETED:
        return this.renderPurchaseConfirmation()
      case purchaseState.ERROR:
        return this.renderConfirmationError()
      case purchaseState.PENDING_COMPLETED:
        // Modal For Pending Review/Rating Transaction
      default:
        return this.renderRatingForm()
    }
  }

  handleChange(name, value) {
    this.setState({[name]: value})
  }

  submit(model) {
    this.props.openModal({
      title: 'Submitting your review',
      content: "Your review is being sumitted. Please don't close this window until it's finished.",
    })

    this.props.createReview(this.props.purchase, this.state)
      .then(() => this.props.closeModal())
  }

  renderDate(epochTime) {
    var convertedDate = new Date(0)
    // Convert PurchaseTime epoch to Date Object
    convertedDate.setUTCSeconds(epochTime)
    return convertedDate.toLocaleString()
  }

  renderRatingForm() {
    return (
      <div className="col-md-6">
        <section>
          <h1>Transaction Information</h1>

          <div className="field-group">
            <div className="field">
              <label htmlFor="field-seller-name">Seller Name</label>
              <input id="field-seller-name" type="text" className="form-control"
                     placeholder="Seller Name"
                     value={this.props.purchase.seller.fullname}
                     disabled />
            </div>
            <div className="field">
              <label htmlFor="field-purchase-date">Purchase Date</label>
              <input id="field-purchase-date" type="text" className="form-control"
                     placeholder="Purchase Date"
                     value={this.renderDate(this.props.purchase.purchased_time)}
                     disabled />
            </div>
            <div className="field">
              <label htmlFor="field-shipping-date">Shipping Date</label>
              <input id="field-shipping-date" type="text" className="form-control"
                     placeholder="Shipping Date"
                     value={this.renderDate(this.props.purchase.shipped_time)}
                     disabled />
            </div>
          </div>

          <hr/>

          <Form layout='vertical' onValidSubmit={this.submit.bind(this)} className='ratingForm'>

            <h2>Seller Review</h2>
            <Textarea
              value={this.state.seller_review}
              name='seller_review'
              type='text'
              className='form-control'
              onChange={this.handleChange.bind(this)} />

            <h2>Seller Rating</h2>
            <div className="rating">
              <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                      'fa fa-star-o fa-2x medium',
                      'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                      full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                        'fa fa-star fa-2x medium',
                        'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                      initialRate={this.state.seller_rating}
                      onChange={(rate) => this.setState({seller_rating: rate})} />
            </div>

            <hr />
            <h2>Item Review</h2>

            <Textarea
              value={this.state.item_review}
              name='item_review'
              type='text'
              className='form-control'
              onChange={this.handleChange.bind(this)} />

            <h2>Item Rating</h2>
            <div className="rating">
              <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                        'fa fa-star-o fa-2x medium',
                        'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                      full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                        'fa fa-star fa-2x medium',
                        'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                      initialRate={this.state.item_rating}
                      onChange={(rate) => this.setState({item_rating: rate})} />
            </div>

            <div className="text-right">
              <button type="submit" className="checkout-btn-next-step">
                Confirm Order
                <i className="ion-chevron-right"></i>
              </button>
            </div>
          </Form>
        </section>
      </div>
    )
  }

  render() {
    if (!this.props.purchase.id) {
      return <div>Loading..</div>
    }
    return (
      <div id="checkout">
        <div className="container">
          <div className="row">
            { this.renderFormOrConfirmation() }
            <PurchaseSummary item={this.props.purchase.item} finalPrice={this.props.purchase.amount} purchase={this.props.purchase} />
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { purchase: purchase(state) }
}

export default withTransactionWatcher('ItemConfirm')(connect(mapStateToProps, { selectPurchase, createReview })(PurchaseConfirm))
