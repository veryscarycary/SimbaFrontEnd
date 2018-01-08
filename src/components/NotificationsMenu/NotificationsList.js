import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const NOTIFICATION_TYPE_PURCHASE = 'purchase'
const NOTIFICATION_TYPE_SHIP = 'ship_item'
const NOTIFICATION_TYPE_CONFIRM = 'confirm_purchase'
const NOTIFICATION_TYPE_CANCEL_PURCHASE = 'cancel_purchase'
const NOTIFICATION_TYPE_CANCEL_SALE = 'cancel_sales'

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
      case NOTIFICATION_TYPE_SHIP:
        return (
          <Link
            key={notification.id}
            to={`/purchases/${notification.target.purchase.id}/confirm`}
            className="dropdown-item"
          >
            {notification.actor.fullname} has shipped your item.
          </Link>
        )
      case NOTIFICATION_TYPE_CANCEL_PURCHASE:
        return (
          <Link
            key={notification.id}
            to={`/purchases/${notification.target.purchase.id}/cancel`}
            className="dropdown-item"
          >
            {notification.actor.fullname} has canceled their order.
          </Link>
        )
      case NOTIFICATION_TYPE_CANCEL_SALE:
        return (
          <Link
            key={notification.id}
            to={`/purchases/${notification.target.purchase.id}/cancel`}
            className="dropdown-item"
          >
            {notification.actor.fullname} has canceled your order.
          </Link>
        )
      case NOTIFICATION_TYPE_CONFIRM:
        return (
          <Link
            key={notification.id}
            to={`/purchases/${notification.target.purchase.id}/confirm`}
            className="dropdown-item"
          >
            {notification.actor.fullname} has received your item.
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
