import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import { fetchNotifications } from '../../actions/actions_notifications'
import { getNotifications } from '../../models/selectors'

class NotificationsList extends Component {
  componentWillMount() {
    this.props.fetchNotifications()
  }

  renderNotification(notification) {
    console.log(notification)
    switch (notification.notificationType) {
      case 'puchase':
        return (
          <Link to={`/purchases/${notification.target.id}`} className="dropdown-item" href="#">
            {notification.actor.name} has shipped {notification.target.item}
          </Link>
        )

      return null
    }
  }

  render() {
    return (
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {this.props.notifications.map((notification) => (
          this.renderNotification(notification)
        ))}

        <Link to="/notifications" className="dropdown-item" href="#">See all</Link>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  notifications: getNotifications(state),
})

const mapDispatchToProps = (dispatch) => bindActionCreators({
  fetchNotifications
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsList)
