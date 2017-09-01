import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Rating from 'react-rating'

import '../../style/items_collection.css'

import { fetchAllItems } from '../../actions/actions_items'
import { items } from '../../models/selectors'

class ItemIndex extends Component {
  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.fetchAllItems(this.props.provider)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchAllItems(nextProps.provider)
    }
  }

  renderRating(item) {
    return (
      <div className="rating">
        <Rating empty={['fa fa-star-o low', 'fa fa-star-o low',
                        'fa fa-star-o medium',
                        'fa fa-star-o high', 'fa fa-star-o high']}
                full={['fa fa-star low', 'fa fa-star low',
                  'fa fa-star medium',
                  'fa fa-star high', 'fa fa-star high']}
                fractions={2}
                initialRate={item.rating}
                readonly />
        ({ item.number_rating })
      </div>
    )
  }

  renderDiscountPrice(item) {
    if (!item.discount || item.discount === 0) {
      return <span className='price'>{ item.price } ETH</span>
    }
    const discountedPrice = item.price * (item.discount / 100)
    return (
      <span className="price">
        <span className="before">
          { item.price } ETH
        </span>

        <span className="from">from </span>
        { discountedPrice } ETH
      </span>
    )
  }

  renderItems() {
    let items = this.props.items.map((item) => {
      return (
        <div key={item.id}  className="col-lg-3 col-md-4 col-sm-6 store-product">
          <Link to={`/items/${item.id}`}>
            { item.discount != 0 ? <span className="flag">{ item.discount }% off</span> : '' }
            <img src={ item.picture } alt={ item.name } className="img-fluid" />
          </Link>
          <span className="info">
            <Link to={`/items/${item.id}`} className='name'>
              { item.name } <br/>
              <span className="vendor"> { item.user.fullname }</span>
            </Link>
            { this.renderDiscountPrice(item) }
          </span>
          { this.renderRating(item) }
        </div>
      )
    })

    return items
  }

  render() {
    return (
      <div className="featured-products">
        <div className="container">
          <h3>Featured products</h3>

          <div className="row">
            { this.renderItems() }
          </div>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { items: items(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchAllItems })(ItemIndex)
