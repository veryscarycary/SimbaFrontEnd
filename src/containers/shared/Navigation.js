import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { ButtonToolbar, DropdownButton, MenuItem } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import Eth from 'ethjs'

import { setCurrentUser } from '../../actions/actions_users'
import { current_user } from '../../models/selectors'
import { cancelTimeoutOrders, fetchEscrowBalance } from '../../actions/actions_contract'

import '../../style/navigation.css'

class Navigation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      escrowBalance: 0
    }
  }

  componentWillMount() {
    if (this.props.provider.eth) {
      this.props.fetchEscrowBalance(this.props.provider).then(transaction => {
        this.setState({escrowBalance: Eth.fromWei(transaction, 'ether').valueOf()})
      })
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.provider.eth && !this.props.provider.eth) {
      this.props.fetchEscrowBalance(nextProps.provider).then(transaction => {
        this.setState({escrowBalance: Eth.fromWei(transaction, 'ether').valueOf()})
      })
    }
  }

  signOut(event) {
    event.preventDefault()
    localStorage.removeItem('simba_wallet')
    localStorage.removeItem('simba_token')
    this.props.setCurrentUser(this.props.provider, this.props.current_user.wallet, '')
  }

  checkTimeout(event) {
    event.preventDefault()
    this.props.cancelTimeoutOrders(this.props.provider)
  }

  renderSearchBarMyAccount() {
    return (
      <div className="section-top clearfix">
        <a href="index.html" className="logo float-left">
          Simba
        </a>

        <ul className="menu-right float-right">
          <li>
            <div className="search-field">
              <i className="ion-android-search"></i>
              <input type="text" className="input-search" placeholder="Search in store..." />
            </div>
          </li>
          <li>
            <a href="account-orders.html" className="account">
              <i className="ion-person"></i>
              My account
            </a>
          </li>
        </ul>
      </div>
    )
  }

  renderNavigationMenu() {
    return (
      <div className="section-menu clearfix">
        <nav className="navbar navbar-expand-lg navbar-light" role="navigation">
          <button className="navbar-toggler" data-toggle="collapse" data-target="#navbar-collapse">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-center" id="navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Home pages
                  <i className="ion-chevron-down"></i>
                </a>
                <div className="dropdown-menu" role="menu">
                  <a className="dropdown-item" href="../index.html">Business</a>
                  <a className="dropdown-item" href="../index-app.html">Web app</a>
                  <a className="dropdown-item" href="../index-features.html">Features showcase</a>
                  <a className="dropdown-item" href="../agency.html">Creative agency</a>
                  <a className="dropdown-item" href="../index-mobile.html">App showcase</a>
                  <a className="dropdown-item" href="../index-mobile-2.html">App showcase 2</a>
                  <a className="dropdown-item" href="../index-mobile-3.html">App showcase 3</a>
                  <a className="dropdown-item" href="../index-mobile-4.html">App showcase 4</a>
                  <a className="dropdown-item" href="../index-slider.html">Hero Slider</a>
                  <a className="dropdown-item" href="../index-photography.html">Photography</a>
                  <a className="dropdown-item" href="../index-dark.html">Dark background</a>
                  <a className="dropdown-item" href="../index-restaurant.html">Restaurant</a>
                  <a className="dropdown-item" href="../index-event.html">Event</a>
                  <a className="dropdown-item" href="../index-event.html">Event</a>
                  <a className="dropdown-item" href="../index-video.html">Video background</a>
                  <a className="dropdown-item" href="../intro.html">Intro</a>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Blogs
                  <i className="ion-chevron-down"></i>
                </a>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Pages
                  <i className="ion-chevron-down"></i>
                </a>
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#" data-toggle="dropdown">
                      About us
                      <i className="ion-chevron-right"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="../agency-about.html">About us 1</a>
                      <a className="dropdown-item" href="../agency-about-2.html">About us 2</a>
                    </div>
                  </div>
                  <div className="dropdown dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#" data-toggle="dropdown">
                      Portfolio
                      <i className="ion-chevron-right"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="../agency-portfolio-2.html">2 columns</a>
                      <a className="dropdown-item" href="../agency-portfolio-3.html">3 columns</a>
                      <a className="dropdown-item" href="../agency-portfolio-4.html">4 columns</a>
                    </div>
                  </div>
                  <div className="dropdown dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#" data-toggle="dropdown">
                      Contact
                      <i className="ion-chevron-right"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="../agency-contact.html">Contact us 1</a>
                      <a className="dropdown-item" href="../agency-contact-2.html">Contact us 2</a>
                      <a className="dropdown-item" href="../agency-start-project.html">Contact us project</a>
                    </div>
                  </div>
                  <a className="dropdown-item" href="../agency-project.html">Project showcase</a>
                  <a className="dropdown-item" href="../pricing.html">Pricing</a>
                  <a className="dropdown-item" href="../pricing-charts.html">Pricing charts</a>
                  <a className="dropdown-item" href="../careers.html">Careers</a>
                  <a className="dropdown-item" href="../career-post.html">Careers job post</a>
                  <a className="dropdown-item" href="../support.html">Support</a>
                  <a className="dropdown-item" href="../support-topic.html">Support topic</a>
                  <a className="dropdown-item" href="../customers.html">Customer stories</a>
                  <a className="dropdown-item" href="../customer-story.html">Single customer story</a>
                  <a className="dropdown-item" href="../sign-up.html">Sign up</a>
                  <a className="dropdown-item" href="../sign-in.html">Sign in</a>
                  <a className="dropdown-item" href="../recover-password.html">Recover password</a>
                  <a className="dropdown-item" href="../timeline.html">Timeline</a>
                  <a className="dropdown-item" href="../coming-soon.html">Coming soon</a>
                  <a className="dropdown-item" href="../api-docs.html">API docs</a>
                </div>
              </li>
              <li className="nav-item dropdown dropdown-extend">
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Components
                  <i className="ion-chevron-down"></i>
                </a>
                <div className="dropdown-menu dropdown-extend-menu">
                  <div className="row">
                    <section className="col-md-3">
                      <h3>For men</h3>
                      <a href="../docs/alerts.html">Alerts</a>
                      <a href="../docs/animations.html">Animations</a>
                      <a href="../docs/badges.html">Badges</a>
                      <a href="../docs/buttons.html">Buttons</a>
                      <a href="../docs/button-groups.html">Button groups</a>
                      <a href="../docs/cards.html">Cards</a>
                    </section>
                    <section className="col-md-3">
                      <h3>For kids</h3>
                      <a href="../docs/carousel.html">Carousel</a>
                      <a href="../docs/accordion.html">Accordion</a>
                      <a href="../docs/cta.html">Call to action</a>
                      <a href="../docs/dropdowns.html">Dropdowns</a>
                      <a href="../docs/forms.html">Forms</a>
                      <a href="../docs/input-groups.html">Input groups</a>
                    </section>
                    <section className="col-md-3">
                      <h3>Accesories</h3>
                      <a href="../docs/icons.html">Icons</a>
                      <a href="../docs/list-groups.html">List groups</a>
                      <a href="../docs/modals.html">Modals</a>
                      <a href="../docs/navs.html">Navs</a>
                      <a href="../docs/navbars.html">Navbars</a>
                      <a href="../docs/plugins.html">New plugins</a>
                    </section>
                    <section className="col-md-3">
                      <h3>Utilities</h3>
                      <a href="../docs/progress.html">Progress bars</a>
                      <a href="../docs/stats-cards.html">Stats cards</a>
                      <a href="../docs/tables.html">Tables</a>
                      <a href="../docs/typography.html">Typography</a>
                    </section>
                  </div>
                </div>
              </li>
              <li className="nav-item dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Features
                  <i className="ion-chevron-down"></i>
                </a>
                <div className="dropdown-menu" role="menu">
                  <div className="dropdown dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#" data-toggle="dropdown">
                      Headers
                      <i className="ion-chevron-right"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="../header-light.html">Light</a>
                      <a className="dropdown-item" href="../header-dark.html">Dark</a>
                      <a className="dropdown-item" href="../header-transparent-light.html">Transparent light</a>
                      <a className="dropdown-item" href="../header-transparent-dark.html">Transparent dark</a>
                      <a className="dropdown-item" href="../header-transparent-fixed-light.html">Transparent fixed light</a>
                      <a className="dropdown-item" href="../header-transparent-fixed-dark.html">Transparent fixed dark</a>
                      <a className="dropdown-item" href="../header-off-canvas-left.html">Sidebar left</a>
                      <a className="dropdown-item" href="../header-off-canvas-right.html">Sidebar right</a>
                      <a className="dropdown-item" href="../header-navleft.html">Navbar left</a>
                      <a className="dropdown-item" href="../header-dark-submenu.html">Dark submenu</a>
                      <a className="dropdown-item" href="../header-fixed-bottom.html">Bottom fixed</a>
                      <a className="dropdown-item" href="../header-logo-center.html">Logo center</a>
                      <a className="dropdown-item" href="../header-all-center.html">All center</a>
                      <a className="dropdown-item" href="../header-full-width.html">Full width</a>
                    </div>
                  </div>
                  <div className="dropdown dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#" data-toggle="dropdown">
                      Footers
                      <i className="ion-chevron-right"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="../header-light.html#footer">Dark</a>
                      <a className="dropdown-item" href="../footer-light.html#footer">Light</a>
                      <a className="dropdown-item" href="../footer-big-menu.html#footer">Big Menu</a>
                      <a className="dropdown-item" href="../footer-sign-up.html#footer">Sign up</a>
                      <a className="dropdown-item" href="../footer-agency.html#footer">Agency</a>
                    </div>
                  </div>
                  <div className="dropdown dropdown-submenu">
                    <a className="dropdown-item dropdown-toggle" href="#" data-toggle="dropdown">
                      Email templates
                      <i className="ion-chevron-right"></i>
                    </a>
                    <div className="dropdown-menu">
                      <a className="dropdown-item" href="../email-template-newsletter.html" target="_blank">
                        Newsletter
                        <i className="ion-share"></i>
                      </a>
                      <a className="dropdown-item" href="../email-template-receipt.html" target="_blank">
                        Receipt
                        <i className="ion-share"></i>
                      </a>
                      <a className="dropdown-item" href="../email-template-announcement.html" target="_blank">
                        Simple announcement
                        <i className="ion-share"></i>
                      </a>
                      <a className="dropdown-item" href="../email-template-text.html" target="_blank">
                        Formal text
                        <i className="ion-share"></i>
                      </a>
                    </div>
                  </div>
                  <a className="dropdown-item" href="../docs/grid-system.html">Grid system</a>
                  <a className="dropdown-item" href="../docs/animations.html">Animations</a>
                  <a className="dropdown-item" href="../docs/typography.html">Typography</a>
                </div>
              </li>
              <li className="nav-item active dropdown">
                <a href="#" className="nav-link dropdown-toggle" data-toggle="dropdown">
                  Shop
                  <i className="ion-chevron-down"></i>
                </a>
                <div className="dropdown-menu dropdown-menu-right" role="menu">
                  <a className="dropdown-item" href="index.html">Home page</a>
                  <a className="dropdown-item" href="collection-grid.html">Products grid</a>
                  <a className="dropdown-item" href="collection-list.html">Products list</a>
                  <a className="dropdown-item" href="collection-grid-sidebar.html">Products grid w/ sidebar</a>
                  <a className="dropdown-item" href="collection-list-sidebar.html">Products list w/ sidebar</a>
                  <a className="dropdown-item" href="product.html">Single product</a>
                  <a className="dropdown-item" href="cart.html">Cart</a>
                  <a className="dropdown-item" href="search.html">Search results</a>
                  <a className="dropdown-item" href="checkout.html">Checkout</a>
                  <a className="dropdown-item" href="checkout-payment.html">Checkout ship & payment</a>
                  <a className="dropdown-item" href="checkout-confirmation.html">Checkout confirmation</a>
                  <a className="dropdown-item" href="account-orders.html">My account order history</a>
                  <a className="dropdown-item" href="account-wishlist.html">My account wishlist</a>
                  <a className="dropdown-item" href="account-profile.html">My account profile</a>
                  <a className="dropdown-item" href="account-invoice.html">Order invoice</a>
                  <a className="dropdown-item" href="sign-up.html">Sign up</a>
                  <a className="dropdown-item" href="sign-in.html">Sign in</a>
                </div>
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
  return { current_user : current_user(state), provider: state.provider }
}

export default connect(mapStateToProps, { setCurrentUser, cancelTimeoutOrders, fetchEscrowBalance })(Navigation)
