import { Model, fk, attr } from 'redux-orm'
import propTypesMixin from 'redux-orm-proptypes'

import { FETCH_NOTIFICATIONS_SUCCEEDED, UPDATE_NOTIFICATION, UPDATE_NOTIFICATION_SUCCEEDED } from '../actions/actions_notifications'

const ValidatingModel = propTypesMixin(Model)

export default class Notification extends ValidatingModel {
  static modelName = 'Notification'
  static fields = {
    target: attr(),
    read_at: attr(),
    notification_type: attr(),
  }

  static reducer(action, Notification, session) {
    switch (action.type) {
      case FETCH_NOTIFICATIONS_SUCCEEDED:
        action.payload.notifications.forEach((notification) => {
          Notification.upsert(notification)
        })

        break

      default:
        {}
    }
  }
}
