import { Model, fk, attr } from 'redux-orm'

import propTypesMixin from 'redux-orm-proptypes'

import { CREATE_REVIEW } from '../actions/actions_reviews'

const ValidatingModel = propTypesMixin(Model)

export default class Review extends ValidatingModel {
  static reducer(action, Review, session) {
    switch (action.type) {
    case CREATE_REVIEW:
      Review.upsert(Object.assign({}, action.payload, {buyer: action.payload.buyer.wallet, seller: action.payload.seller.wallet, item: action.payload.item.id}))
      break
    default:
      {}
    }
  }
}

Review.modelName = 'Review'

Review.fields = {
  id: attr(),
  description: attr(),
  rating: attr(),
  created_at: attr(),
  isItem: attr(),
  buyer: fk('User', 'buyer_reviews'),
  seller: fk('User', 'seller_reviews'),
  item: fk('Item', 'reviews')
}
