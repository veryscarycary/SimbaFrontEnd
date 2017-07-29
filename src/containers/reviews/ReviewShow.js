import React, { Component } from 'react'
import Rating from 'react-rating'

class ReviewShow extends Component {
  render() {
    return (
      <div>
        <Rating empty={['fa fa-star-o fa-2x low', 'fa fa-star-o fa-2x low',
                        'fa fa-star-o fa-2x medium',
                        'fa fa-star-o fa-2x high', 'fa fa-star-o fa-2x high']}
                full={['fa fa-star fa-2x low', 'fa fa-star fa-2x low',
                  'fa fa-star fa-2x medium',
                  'fa fa-star fa-2x high', 'fa fa-star fa-2x high']}
                fractions={2}
                initialRate={this.props.review.rating}
                readonly />
          <p><strong>By { this.props.review.buyer.fullname }</strong> | { this.props.review.created_at }</p>
          <p className='item-show-description'><i>{ this.props.review.description }</i></p>
          <hr />
      </div>
    )
  }
}

export default ReviewShow
