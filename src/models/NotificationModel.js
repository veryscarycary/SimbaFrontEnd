import { Model, fk, attr } from 'redux-orm'
import propTypesMixin from 'redux-orm-proptypes'

import { FETCH_NOTIFICATIONS, UPDATE_NOTIFICATION, UPDATE_NOTIFICATION_SUCCEEDED } from '../actions/actions_notifications'

const ValidatingModel = propTypesMixin(Model)

export default class Notification extends ValidatingModel {
  static modelName = 'Notification'
  static fields = {
    target: attr(),
    readAt: attr(),
    notificationType: attr(),
  }

  static reducer(action, Notification, session) {
    switch (action.type) {
      default:
        {}
    }
  }
}
