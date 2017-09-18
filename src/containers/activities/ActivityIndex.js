import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { activities } from '../../models/selectors'

import { fetchAllActivities } from '../../actions/actions_activities'

class ActivityIndex extends Component {
  componentWillMount() {
    this.props.fetchAllActivities()
  }

  renderActivities() {
    let activities = this.props.activities.map((activity) => {
      return (
        <tr key={activity.id}>
          <td>{ activity.created_at }</td>
          <td>{ activity.category }</td>
          <td>{ activity.buyer.fullname }</td>
          <td>{ activity.seller.fullname }</td>
          <td>{ activity.purchase.id }</td>
          <td><Link to={`/items/${activity.item.id}`}>{ activity.item.name }</Link></td>
          <td>{ activity.amount }</td>
        </tr>
      )
    })

    return activities
  }

  render() {
    return (
      <div className="pure-g list-items">
        <div className='pure-u-1'>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Buyer</th>
                <th>Seller</th>
                <th>PurchaseId</th>
                <th>Item</th>
                <th>Amount/Code</th>
              </tr>
            </thead>
            <tbody>
              { this.props.activities ? this.renderActivities() : '' }
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { activities: activities(state) }
}

export default connect(mapStateToProps, { fetchAllActivities })(ActivityIndex)
