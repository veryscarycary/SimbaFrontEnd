import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const NOTIFICATION_TYPE_PURCHASE = 'purchase'

class NotificationsList extends Component {
  renderNotification(notification) {
    switch (notification.notification_type) {

      case NOTIFICATION_TYPE_PURCHASE:
        return (
          <Link
            key={notification.id}
            to={`/purchases/${notification.target.purchase.id}/shipping`}
            className="dropdown-item"
          >
            {notification.actor.fullname} has bought something from you.
          </Link>
        )

      default: return null
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

export default NotificationsList
