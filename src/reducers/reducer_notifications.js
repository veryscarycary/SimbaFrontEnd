import { FETCH_NOTIFICATIONS_SUCCEEDED, UPDATE_NOTIFICATION, UPDATE_NOTIFICATION_SUCCEEDED } from '../actions/actions_notifications'

export default function(state = 0, action) {
  switch(action.type) {
    case FETCH_NOTIFICATIONS_SUCCEEDED:
    case UPDATE_NOTIFICATION:
    case UPDATE_NOTIFICATION_SUCCEEDED:

    default:
      return state
  }
}
