import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import NotificationsList from './NotificationsList'

class NotificationsDropdown extends Component {

  render() {
    return (
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        <NotificationsList notifications={this.props.notifications}/>

        <Link to="/notifications" className="dropdown-item" href="#">See all</Link>
      </div>
    )
  }
}

export default NotificationsDropdown
