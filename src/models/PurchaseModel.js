import { Model, fk, attr } from 'redux-orm'
import propTypesMixin from 'redux-orm-proptypes'

import { CREATE_PURCHASES, UPDATE_PURCHASE } from '../actions/actions_purchases'

import { purchaseState } from '../containers/shared/PurchaseState'

const ValidatingModel = propTypesMixin(Model)

export default class Purchase extends ValidatingModel {
  static reducer(action, Purchase, session) {
    switch (action.type) {
    case CREATE_PURCHASES:
      if (action.payload) {
        Object.keys(action.payload).forEach(purchaseId => {
          Purchase.upsert(action.payload[purchaseId])
        })
      }
      break
    case UPDATE_PURCHASE:
      Purchase.withId(action.payload.id).update(action.payload)
      break
    default:
      {}
    }
  }
}

Purchase.modelName = 'Purchase'

Purchase.fields = {
  amount: attr(),
  code: attr(),
  address: attr(),
  postal_code: attr(),
  city: attr(),
  country: attr(),
  us_state: attr(),
  purchaseState: attr(),
  shipping_deadline: attr(),
  buyer: fk('User', 'buyer_purchases'),
  seller: fk('User', 'seller_sales'),
  item: fk('Item', 'purchases')
}

Purchase.defaultProps = {
  purchaseState: purchaseState.NEW
}
