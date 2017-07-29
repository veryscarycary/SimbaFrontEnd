import { Model, fk, attr } from 'redux-orm'
import propTypesMixin from 'redux-orm-proptypes'

import { CREATE_ITEMS, CREATE_ITEM, UPDATE_ITEM } from '../actions/actions_items'

const ValidatingModel = propTypesMixin(Model)

export default class Item extends ValidatingModel {
  static reducer(action, Item, session) {
    switch (action.type) {
    case CREATE_ITEMS:
      if (action.payload) {
        Object.keys(action.payload).forEach(itemId => {
          Item.upsert(action.payload[itemId])
        })
      }
      break
    case CREATE_ITEM:
      Item.upsert(action.payload)
      break
    case UPDATE_ITEM:
      Item.withId(action.payload.id).update(action.payload)
      break
    default:
      {}
    }
  }
}

Item.modelName = 'Item'

Item.fields = {
  id: attr(),
  name: attr(),
  price: attr(),
  discount: attr(),
  shipping_fee: attr(),
  short_description: attr(),
  description: attr(),
  picture: attr(),
  reference: attr(),
  sales: attr(),
  rating: attr(),
  number_rating: attr(),
  number_reviews: attr(),
  user: fk('User', 'items'),
}

Item.defaultProps = {
    sales: 0,
    rating: 0,
    number_rating: 0,
    number_reviews: 0
};

