import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { deleteCurrentUser } from '../../actions/actions_users'
import { current_user } from '../../models/selectors'
import { cancelTimeoutOrders, withdrawBalance } from '../../actions/actions_contract'

import Auth from '../../services/auth'
import NotificationsMenu from '../../containers/notifications/NotificationsMenu'

import '../../style/navigation.css'

class Navigation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMyBalanceHovered: false,
      isMyAccountHovered: false,
      isLink1Hovered: false,
      isLink2Hovered: false,
      isLink3Hovered: false,
      isLink4Hovered: false,
      isLink5Hovered: false,
      isLink6Hovered: false
    }
  }

  signOut(event) {
    event.preventDefault()
    this.props.deleteCurrentUser(this.props.current_user.wallet)

    this.props.history.push('/')
  }

  checkTimeout(event) {
    event.preventDefault()
    this.props.cancelTimeoutOrders()
  }

  withdrawFunds(event) {
    event.preventDefault()
    this.props.withdrawBalance()
  }

  renderUserBalance() {
    return (
      <div className={`dropdown ${this.state.isMyBalanceHovered ? 'show' : ''}`}
           onMouseEnter={() => this.setState({ isMyBalanceHovered: !this.state.isMyBalanceHovered })}
           onMouseLeave={() => this.setState({ isMyBalanceHovered: !this.state.isMyBalanceHovered })}>
        <a href="account-orders.html" className="account dropdown-toggle" data-toggle="dropdown">
          <i className="ion-social-bitcoin"></i>
          { this.props.current_user.escrow_balance } ETH
        </a>
        <div className="dropdown-menu dropdown-menu-dark" role="menu">
          <a className="dropdown-item" href="/" onClick={(e) => this.withdrawFunds(e)}>Withdraw Funds</a>
        </div>
      </div>
    )

  }

  renderUserMenu() {
    return (
      <div className={`dropdown ${this.state.isMyAccountHovered ? 'show' : ''}`}
           onMouseEnter={() => this.setState({ isMyAccountHovered: !this.state.isMyAccountHovered })}
           onMouseLeave={() => this.setState({ isMyAccountHovered: !this.state.isMyAccountHovered })}>
        <a href="account-orders.html" className="account dropdown-toggle" data-toggle="dropdown">
          <i className="ion-person"></i>
          { this.props.current_user.first_name }
        </a>
        <div className="dropdown-menu dropdown-menu-dark" role="menu">
          <span className="dropdown-header">My Profile</span>
          <Link className="dropdown-item" to='/users/me'>Information</Link>
          <a className="dropdown-item" href="/" onClick={(event) => this.signOut(event)}>Sign out</a>

          <span className="dropdown-header">Purchases</span>
          <Link className="dropdown-item" to='/purchases'>Order History</Link>

          <span className="dropdown-header">Sales</span>
          <Link className="dropdown-item" to='/listing/create'>Add New Listing</Link>
          <Link className="dropdown-item" to='/my_items'>My Items</Link>
          <Link className="dropdown-item" to='/sales'>Sales History</Link>

          <span className="dropdown-header">Admin</span>
          <Link className="dropdown-item" to='/admin/dashboard'>Admin</Link>
          <Link className="dropdown-item" to='/admin/activities'>Manage Activities</Link>
          <a className="dropdown-item"  href="/" onClick={(e) => this.checkTimeout(e)}>Check Timeout</a>
        </div>
      </div>
    )
  }

  renderSearchBar() {
    return (
      <div className="search-field">
        <i className="ion-android-search"></i>
        <input type="text" className="input-search" placeholder="Search in store..." />
      </div>
    )
  }

  renderNotifications() {
    return (
      Auth.isLoggedIn() && (
        <li>
          <NotificationsMenu
            unreadCount={2}
          />
        </li>
      )
    )
  }

  renderHome() {
    return (
      <li className={`nav-item dropdown ${this.state.isLink2Hovered ? 'show' : ''}`}
          onMouseEnter={() => this.setState({ isLink2Hovered: !this.state.isLink2Hovered })}
          onMouseLeave={() => this.setState({ isLink2Hovered: !this.state.isLink2Hovered })} >
        <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
          Home
          <i className="ion-chevron-down"></i>
        </a>
      </li>
    )
  }

  renderNavigationMenu() {
    return (
      <div className="section-menu clearfix">
        <nav className="navbar navbar-expand-lg navbar-light" role="navigation">
          <button className="navbar-toggler" data-toggle="collapse" data-target="/navbar-collapse">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbar-collapse">
            <ul className="navbar-nav">
              { this.renderHome() }
              <li className={`nav-item dropdown ${this.state.isLink1Hovered ? 'show' : ''}`}
                  onMouseEnter={() => this.setState({ isLink1Hovered: !this.state.isLink1Hovered })}
                  onMouseLeave={() => this.setState({ isLink1Hovered: !this.state.isLink1Hovered })} >
                <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Clothes
                  <i className="ion-chevron-down"></i>
                </a>
              </li>

              <li className={`nav-item dropdown ${this.state.isLink3Hovered ? 'show' : ''}`}
                  onMouseEnter={() => this.setState({ isLink3Hovered: !this.state.isLink3Hovered })}
                  onMouseLeave={() => this.setState({ isLink3Hovered: !this.state.isLink3Hovered })} >
                <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Electronics
                  <i className="ion-chevron-down"></i>
                </a>
              </li>
              <li className={`nav-item dropdown dropdown-extend ${this.state.isLink4Hovered ? 'show' : ''}`}
                  onMouseEnter={() => this.setState({ isLink4Hovered: !this.state.isLink4Hovered })}
                  onMouseLeave={() => this.setState({ isLink4Hovered: !this.state.isLink4Hovered })} >
                <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Services
                  <i className="ion-chevron-down"></i>
                </a>
              </li>
              <li className={`nav-item dropdown ${this.state.isLink5Hovered ? 'show' : ''}`}
                  onMouseEnter={() => this.setState({ isLink5Hovered: !this.state.isLink5Hovered })}
                  onMouseLeave={() => this.setState({ isLink5Hovered: !this.state.isLink5Hovered })} >
                <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Ticket
                  <i className="ion-chevron-down"></i>
                </a>
              </li>
              <li className={`nav-item dropdown ${this.state.isLink6Hovered ? 'show' : ''}`}
                  onMouseEnter={() => this.setState({ isLink6Hovered: !this.state.isLink6Hovered })}
                  onMouseLeave={() => this.setState({ isLink6Hovered: !this.state.isLink6Hovered })} >
                <a href="/" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Getaway
                  <i className="ion-chevron-down"></i>
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    )
  }

  render() {
    return (
      <nav className='store-navbar'>
        <div className='container'>
          <div className="section-top clearfix">
            <Link to='/' className="logo float-left"> Simba </Link>
            {
              Auth.isLoggedIn() ? (
                <ul className="menu-right float-right">
                  <li> { this.renderSearchBar() } </li>
                  <li> { this.renderNotifications() } </li>
                  <li> { this.renderUserBalance() } </li>
                  <li> { this.renderUserMenu() } </li>
                </ul>
              ) : (
                <ul className="menu-right float-right">
                  <li> { this.renderSearchBar() } </li>
                  <li><Link to='/users/sign_in' className="account"> <i className="ion-log-in"></i> Sign in </Link></li>
                </ul>
              )
            }
          </div>

          { this.renderNavigationMenu() }
        </div>
      </nav>
    )
  }
}


function mapStateToProps(state) {
  return { current_user : current_user(state) }
}

export default withRouter(
  connect(mapStateToProps, { deleteCurrentUser, cancelTimeoutOrders, withdrawBalance })(Navigation)
)
