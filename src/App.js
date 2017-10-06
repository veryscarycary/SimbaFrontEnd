import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route as RouterRoute, Redirect } from 'react-router-dom'

import { fetchProvider } from './actions/actions_provider'

// Shared Containers
import Navigation from './containers/shared/Navigation'
import Footer from './containers/shared/Footer'

// Devise Containers
import RegistrationForm from './containers/users/RegistrationForm'
import SignInForm from './containers/users/SignInForm'

// Users Containers
import UserIndex from './containers/users/UserIndex'
import UserProfile from './containers/users/UserProfile'

// Items Containers
import ItemNew from './containers/items/ItemNew'
import ItemEdit from './containers/items/ItemEdit'
import ItemIndex from './containers/items/ItemIndex'
import SellerItemsIndex from './containers/items/SellerItemsIndex'
import ItemShow from './containers/items/ItemShow'
import ItemCheckOut from './containers/items/ItemCheckOut'

// Purchase Containers
import PurchaseIndex from './containers/purchases/PurchaseIndex'
import SalesIndex from './containers/purchases/SalesIndex'
import PurchaseShipping from './containers/purchases/PurchaseShipping'
import PurchaseCancel from './containers/purchases/PurchaseCancel'
import PurchaseConfirm from './containers/purchases/PurchaseConfirm'
import PurchaseReceipt from './containers/purchases/PurchaseReceipt'

// Activities Containers
import ActivityIndex from './containers/activities/ActivityIndex'

// Reviews Containers
import ReviewIndex from './containers/reviews/ReviewIndex'

// Admin Dashboard
import DashboardIndex from './containers/dashboard/DashboardIndex'

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
    this.props.fetchProvider()
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
            <Route auth exact path='/users/me' component={UserProfile} />

            <Route auth exact path='/listing/create' component={ItemNew} />
            <Route exact path='/items/:item_id' component={ItemShow} />
            <Route exact path='/items' component={ItemIndex} />
            <Route auth exact path='/items/:item_id/checkout' component={ItemCheckOut} />

            <Route auth exact path='/purchases' component={PurchaseIndex} />
            <Route auth exact path='/sales' component={SalesIndex} />
            <Route auth exact path='/purchases/:purchase_id/shipping' component={PurchaseShipping} />
            <Route auth exact path='/purchases/:purchase_id/cancel' component={PurchaseCancel} />
            <Route auth exact path='/purchases/:purchase_id/confirm' component={PurchaseConfirm} />
            <Route auth exact path='/purchases/:purchase_id/receipt' component={PurchaseReceipt} />

            <Route auth exact path='/admin/activities' component={ActivityIndex} />
            <Route auth exact path='/items/:item_id/edit' component={ItemEdit} />
            <Route auth exact path='/my_items' component={SellerItemsIndex} />
            <Route auth exact path='/admin/dashboard' component={DashboardIndex} />
          </section>
          <section className='footer'>
            <Footer />
          </section>
        </div>
      </Router>
    )
  }
}

export default connect(() => ({}), { fetchProvider })(App)
