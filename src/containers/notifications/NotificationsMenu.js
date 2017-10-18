import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import { createStructuredSelector } from 'reselect'

import { fetchNotifications } from '../../actions/actions_notifications'
import { getNotifications, getUnreadNotificationsCount } from '../../models/selectors'

import NotificationsMenu from '../../components/NotificationsMenu/NotificationsMenu'

class NotifcationsMenuContainer extends Component {
  componentWillMount() {
    this.props.fetchNotifications()
  }

  render() {
    return (
      <NotificationsMenu unreadCount={this.props.unreadCount} notifications={this.props.notifications} />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  notifications: getNotifications,
  unreadCount: getUnreadNotificationsCount
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchNotifications
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NotifcationsMenuContainer)
