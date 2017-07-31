import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Rating from 'react-rating'

import '../../style/item.css'

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

  renderReview(item) {
    return (
      <div>
        <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                        'fa fa-star-o fa-2x medium',
                        'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                  'fa fa-star fa-2x medium',
                  'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                fractions={2}
                initialRate={item.rating}
                readonly />
        ({ item.number_rating })
      </div>

    )
  }

  renderItemPrice(item) {
    if (!item.discount || item.discount === 0) {
      return <span className='item-price'>{ item.price } ETH</span>
    }
    const discountedPrice = item.price * (item.discount / 100)
    return (
      <div className='item-price'>
        <span className='item-original-price'>{ item.price } </span>
        <span className='item-discounted-price'> { discountedPrice } ETH ({ item.discount } %)</span>
      </div>
    )
  }

  renderItems() {
    let items = this.props.items.map((item) => {
      return (
        <div key={item.id} className='pure-u-1 pure-u-md-1-3'>
          <Link to={`/items/${item.id}`}>
            <div className='thumbnail'>
              <img src={ item.picture } alt={ item.name } />
              <div className="caption">
                <span className='item-name'>{ item.name }</span>
                <span className='item-seller'>Sell by { item.user.fullname } ({ item.user.rating })</span>
                <span className='item-description'>{ item.short_description }</span>
                { this.renderReview(item) }
                <span className='item-ratings-sales'>{ item.sales } sold</span>
                { this.renderItemPrice(item) }
              </div>
            </div>
          </Link>
        </div>
      )
    })

    return items
  }

  render() {
    return (
      <div className="pure-g list-items">
        { this.props.items ? this.renderItems() : '' }
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { items: items(state), provider: state.provider }
}

export default connect(mapStateToProps, { fetchAllItems })(ItemIndex)
