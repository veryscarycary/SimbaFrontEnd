import React, { Component } from 'react'

class PurchaseSummary extends Component {
  renderDiscount() {
    if (!this.props.item.discount || this.props.item.discount === 0) {
      return <div></div>
    }
    const discountedPrice = this.props.item.price * (this.props.item.discount / 100)
    return (
      <div className="detail clearfix">
        <p>Discount</p>
        <span>- { discountedPrice } ETH</span>
      </div>
    )
  }

  render() {
    return (
      <div className="col-md-6">
        <div id="checkout-cart-summary" className="clearfix float-right">
          <h3>Order { this.props.purchase.id ? this.props.purchase.id : 'Summary' }</h3>
          <div className="line-items">
            <div className="item clearfix">
              <div className="pic">
                <img src={ this.props.item.picture } className="img-responsive" alt={ this.props.item.name } />
              </div>
              <div className="details">
                <span className="name">
                  { this.props.item.name }
                </span>
                <span className="variant">
                  Ship within { this.props.item.shipping_deadline } days
                </span>
              </div>
              <div className="price float-right">
                { this.props.item.price } ETH
              </div>
            </div>
          </div>
          <div className="price-details">
            { this.renderDiscount() }
            <div className="detail clearfix">
              <p>Shipping</p>
              <span>{ this.props.item.shipping_fee } ETH</span>
            </div>
            <div className="detail clearfix">
              <p>Taxes</p>
              <span>$15.00</span>
            </div>
            <div className="total-price clearfix">
              <p>Total payment</p>
              <span>{ this.props.finalPrice } ETH</span>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default PurchaseSummary
