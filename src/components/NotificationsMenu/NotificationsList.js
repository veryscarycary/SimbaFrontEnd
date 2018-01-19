import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import TimeAgo from 'react-timeago'

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
            {notification.actor.fullname} has bought a {notification.target.purchase.item.name} <strong><TimeAgo date={notification.created_at}/></strong>.
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
            {notification.actor.fullname} has received your item. Your funds are available to be withdrawn.
          </Link>
        )

      default: return null
    }
  }

  render() {
    return (
      <div>
        {this.props.notifications.map((notification) => (
          this.renderNotification(notification)
        ))}
      </div>
    )
  }
}

export default NotificationsList
