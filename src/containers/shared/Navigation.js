import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'

import { deleteCurrentUser } from '../../actions/actions_users'
import { current_user } from '../../models/selectors'
import { cancelTimeoutOrders } from '../../actions/actions_contract'

import Auth from '../../services/auth'

import '../../style/navigation.css'

class Navigation extends Component {
  constructor(props) {
    super(props)

    this.state = {
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

  renderSearchBarMyAccount() {
    return (
      <div className="section-top clearfix">
        <Link to='/' className="logo float-left"> Simba </Link>

        <ul className="menu-right float-right">
          <li>
            <div className="search-field">
              <i className="ion-android-search"></i>
              <input type="text" className="input-search" placeholder="Search in store..." />
            </div>
          </li>
          {
            Auth.isLoggedIn() ? (
              <li>
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
                    <Link className="dropdown-item" to='/admin/activities'>Manage Activities</Link>
                    <a className="dropdown-item"  href="/" onClick={(e) => this.checkTimeout(e)}>Check Timeout</a>
                  </div>
                </div>
              </li>
            ) : (
              <li>
                <Link to='/users/sign_in' className="account"> Sign in </Link>
              </li>
            )
           }
           {
              Auth.isLoggedIn() ?
                '' : (
                  <li>
                    <Link to='/users/register' className="account"> Register </Link>
                  </li>
                )
           }
        </ul>
      </div>
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
          { this.renderSearchBarMyAccount() }
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
  connect(mapStateToProps, { deleteCurrentUser, cancelTimeoutOrders })(Navigation)
)
