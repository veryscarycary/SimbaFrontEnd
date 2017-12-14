import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Link } from 'react-router-dom'
import NotificationsList from './NotificationsList'

class NotificationsMenu extends Component {
  static propTypes = {
    unreadCount: PropTypes.number,
    notifications: PropTypes.array,
  }

  static defaultProps = {
    unreadCount: 0,
    notifications: [],
  }

  state = { hovered: false }

  handleClick = (event) => {
    event.preventDefault()
    this.setState({ hovered: !this.state.hovered })
  }

  render() {
    return (
      <div className={classnames('dropdown', this.state.hovered && 'show' )}>
        <a
          to="/notifications"
          className="account dropdown-toggle"
          onClick={this.handleClick.bind(this)}
          style={{ cursor: 'pointer' }}
        >
          <i className="ion-ios-bell"></i>
          <span>
            Notifications
          </span>

          {this.props.unreadCount > 0 && (
            <span className="ml-1 badge badge-pill badge-danger">{this.props.unreadCount}</span>
          )}
        </a>

        <NotificationsList notifications={this.props.notifications} />
      </div>
    )
  }
}

export default NotificationsMenu
