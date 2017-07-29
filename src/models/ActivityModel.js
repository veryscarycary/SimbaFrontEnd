import { Model, fk, attr } from 'redux-orm'

import { CREATE_ACTIVITIES } from '../actions/actions_activities'

export default class Activity extends Model {
  static reducer(action, Activity, session) {
    switch (action.type) {
    case CREATE_ACTIVITIES:
      if (action.payload) {
        Object.keys(action.payload).forEach(activityId => {
          Activity.upsert(action.payload[activityId])
        })
      }
      break
    default:
      {}
    }
  }
}

Activity.modelName = 'Activity'

Activity.fields = {
  amount: attr(),
  buyer: fk('User', 'buyer_activities'),
  seller: fk('User', 'seller_activities'),
  item: fk('Item', 'activities'),
  purchase: fk('Purchase', 'activities')
}
