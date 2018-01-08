import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createStructuredSelector } from 'reselect'
import { fetchNotifications } from '../../actions/actions_notifications'
import { getNotifications } from '../../models/selectors'

import NotificationsList from '../../components/NotificationsMenu/NotificationsList'

class NotificationsIndex extends Component {
  componentWillMount() {
    this.props.fetchNotifications()
  }

  render() {
    return (
      <div className="featured-products">
        <div className="container">
          <h3>Notifications</h3>
          <NotificationsList notifications={this.props.notifications}/>
        </div>
      </div>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  notifications: getNotifications
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchNotifications
}, dispatch)

export default connect(mapStateToProps,mapDispatchToProps)(NotificationsIndex)
