import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route as RouterRoute, Redirect } from 'react-router-dom'

import { setCurrentUser } from './actions/actions_users'
import { fetchProvider } from './actions/actions_provider'

// Shared Containers
import Navigation from './containers/shared/Navigation'
import Footer from './containers/shared/Footer'

// Devise Containers
import RegistrationForm from './containers/users/RegistrationForm'
import SignInForm from './containers/users/SignInForm'

// Users Containers
import UserIndex from './containers/users/UserIndex'

// Items Containers
import ItemNew from './containers/items/ItemNew'
import ItemIndex from './containers/items/ItemIndex'
import ItemShow from './containers/items/ItemShow'
import ItemCheckOut from './containers/items/ItemCheckOut'

// Purchase Containers
import PurchaseInitialize from './containers/purchases/PurchaseInitialize'
import PurchaseConfirmation from './containers/purchases/PurchaseConfirmation'
import PurchaseShipping from './containers/purchases/PurchaseShipping'
import PurchaseIndex from './containers/purchases/PurchaseIndex'
import SalesIndex from './containers/purchases/SalesIndex'

// Activities Containers
import ActivityIndex from './containers/activities/ActivityIndex'

// Reviews Containers
import ReviewIndex from './containers/reviews/ReviewIndex'

import './App.css'

import Auth from './services/auth'

const Route = ({ component: Component, auth, ...rest }) => (
  <RouterRoute
    {...rest}
    render={(props) => (
      !auth ? (
        <Component {...props} />
      ) : (
        Auth.isLoggedIn() ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/users/sign_in',
              state: { from: props.location }
            }}
          />
        )
      )
    )}
  />
)

class App extends Component {
  componentWillMount() {
    this.props.fetchProvider().then(() => {
      this.props.provider.eth.accounts().then((accounts) => {
        if (typeof accounts[0] === 'undefined') {
          this.props.setCurrentUser(this.props.provider, '', Auth.token)
        } else {
          this.props.setCurrentUser(this.props.provider, accounts[0], Auth.token)
        }
      })
    })
  }

  render() {
    return (
      <Router>
        <div className='App'>
          <section className='header'>
            <Navigation />
          </section>
          <section className='main-container'>
            <Route exact path='/' component={ItemIndex} />
            <Route exact path='/users/register' component={RegistrationForm} />
            <Route exact path='/users/sign_in' component={SignInForm} />
            <Route exact path='/users' component={UserIndex} />
            <Route exact path='/users/:user_wallet/reviews' component={ReviewIndex} />
            <Route auth exact path='/listing/create' component={ItemNew} />
            <Route exact path='/items/:item_id' component={ItemShow} />
            <Route exact path='/items' component={ItemIndex} />
            <Route auth exact path='/items/:item_id/checkout' component={ItemCheckOut} />


            <Route auth exact path='/purchases/initialize/:purchase_id' component={PurchaseInitialize} />
            <Route auth exact path='/purchases/shipping/:purchase_id' component={PurchaseShipping} />
            <Route auth exact path='/purchases/confirmation/:purchase_id' component={PurchaseConfirmation} />
            <Route auth exact path='/purchases' component={PurchaseIndex} />
            <Route auth exact path='/sales' component={SalesIndex} />

            <Route auth exact path='/admin/activities' component={ActivityIndex} />
          </section>
          <section className='footer'>
            <Footer />
          </section>
        </div>
      </Router>
    )
  }
}

function mapStateToProps({ provider }) {
  return { provider: provider }
}

export default connect(mapStateToProps, { fetchProvider, setCurrentUser })(App)
