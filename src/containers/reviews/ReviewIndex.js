import React, { Component } from 'react'
import { connect } from 'react-redux'

import ReviewShow from './ReviewShow'
import { selectUser } from '../../actions/actions_users'
import { fetchUserRating } from '../../actions/actions_contract'
import { userReviews, user } from '../../models/selectors'

class ReviewIndex extends Component {
  componentWillMount() {
    this.props.selectUser(this.props.match.params.user_wallet)
    if (this.props.provider.eth) {
      this.props.fetchUserRating(this.props.provider, this.props.match.params.user_wallet)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchUserRating(nextProps.provider, this.props.match.params.user_wallet)
    }
  }

  renderReviews() {
    return (
      this.props.userReviews.map(review => {
        return <ReviewShow key={review.id} review={review} />
      })
    )
  }

  render() {
    return (
      <div className="pure-g list-reviews">
        <div className='pure-u-1'>
          <h3 className='title'>{ this.props.user.fullname } REVIEWS</h3>
          <div className='title-divider'></div>
          { this.props.userReviews ? this.renderReviews() : '' }
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { userReviews: userReviews(state), provider: state.provider, user: user(state) }
}

export default connect(mapStateToProps, { selectUser, fetchUserRating })(ReviewIndex)
