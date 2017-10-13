import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

class NotificationsMenu extends Component {
  static propTypes = {
    unreadCount: PropTypes.number.isRequired,
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

          <span className="ml-1 badge badge-pill badge-danger">{this.props.unreadCount}</span>
        </a>

        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          <a className="dropdown-item" href="#">Action</a>
          <a className="dropdown-item" href="#">Another action</a>
          <a className="dropdown-item" href="#">Something else here</a>
        </div>
      </div>
    )
  }
}

export default NotificationsMenu
