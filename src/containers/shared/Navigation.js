import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

import { setCurrentUser } from '../../actions/actions_users'
import { current_user } from '../../models/selectors'

import '../../style/navigation.css'

class Navigation extends Component {
  signOut(event) {
    event.preventDefault()
    localStorage.removeItem('simba_wallet')
    localStorage.removeItem('simba_token')
    this.props.setCurrentUser(this.props.provider, this.props.current_user.wallet, '')
  }

  render() {
    return (
      <div className='navigation'>
        <div className='header-user'>
          <span>
            { this.props.current_user.wallet ? (
              <span>
                <strong>Balance</strong> : {this.props.current_user.balance} ETH
              </span>
              ) : 'No Wallet detected - Install Metamask or run local node'
            }
          </span>
          { (this.props.current_user.authentication_token && this.props.current_user.wallet) ? (
              <ButtonToolbar>
                <DropdownButton title={ this.props.current_user.wallet } id="dropdown-size-medium">
                  <MenuItem header>Seller</MenuItem>
                  <LinkContainer to='/listing/create'><MenuItem>Create a Listing</MenuItem></LinkContainer>
                  <LinkContainer to='/sales'><MenuItem>My Sales</MenuItem></LinkContainer>
                  <MenuItem divider />
                  <MenuItem header>Buyer</MenuItem>
                  <LinkContainer to='/purchases'><MenuItem>My Purchases</MenuItem></LinkContainer>
                  <MenuItem divider />
                  <MenuItem header>My Profile</MenuItem>
                  <MenuItem onClick={(event) => this.signOut(event)}>Sign out</MenuItem>
                  <MenuItem divider />
                  <MenuItem header>Admin</MenuItem>
                  <LinkContainer to='/admin/activities'><MenuItem>Manage Activities</MenuItem></LinkContainer>
                </DropdownButton>
              </ButtonToolbar>
            ) : (
              <div>
                <Link to='/users/sign_in'>Sign In</Link>
                <Link to='/users/register'>Register</Link>
              </div>
            )
          }
        </div>
        <div className='header-menu'>
          <div className="pure-menu pure-menu-horizontal">
            <div className='logo'>
              <a href="/" className="pure-menu-heading pure-menu-link">SIMBA</a>
            </div>
            <div className='menu-list'>
              <ul className="pure-menu-list">
                <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
                  <a href="/" id="menuLink1" className="pure-menu-link">Goods</a>
                </li>
                <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
                  <a href="/" id="menuLink1" className="pure-menu-link">Digitals</a>
                </li>
                <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
                  <a href="/" id="menuLink1" className="pure-menu-link">Services</a>
                </li>
                <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
                  <a href="/" id="menuLink1" className="pure-menu-link">Getaways</a>
                </li>
                <li className="pure-menu-item pure-menu-has-children pure-menu-allow-hover">
                  <a href="/" id="menuLink1" className="pure-menu-link">Auction</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}


function mapStateToProps(state) {
  return { current_user : current_user(state), provider: state.provider }
}

export default connect(mapStateToProps, { setCurrentUser })(Navigation)
