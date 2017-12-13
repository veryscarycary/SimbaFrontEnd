import { Model, attr } from 'redux-orm'
import propTypesMixin from 'redux-orm-proptypes'

import { CREATE_USERS, CREATE_USER, UPDATE_USER } from '../actions/actions_users'

const ValidatingModel = propTypesMixin(Model)

export default class User extends ValidatingModel {
  static reducer(action, User, session) {
    switch (action.type) {
    case CREATE_USER:
      User.upsert(action.payload)
      break
    case CREATE_USERS:
      if (action.payload) {
        Object.keys(action.payload).forEach(userWallet => {
          User.upsert(action.payload[userWallet])
        })
      }
      break
    case UPDATE_USER:
      User.withId(action.payload.wallet).update(action.payload)
      break
    default:
      {}
    }
  }
}

User.modelName = 'User'

User.options = {
    idAttribute: 'wallet',
}

User.fields = {
  id: attr(),
  wallet: attr(),
  first_name: attr(),
  last_name: attr(),
  fullname: attr(),
  email: attr(),
  address: attr(),
  postal_code: attr(),
  city: attr(),
  country: attr(),
  us_state: attr(),
  authentication_token: attr(),
  sales: attr(),
  rating: attr(),
  number_rating: attr(),
  number_reviews: attr(),
  escrow_balance: attr()
}

User.defaultProps = {
  sales: 0,
  rating: 0,
  number_rating: 0,
  number_reviews: 0
}
