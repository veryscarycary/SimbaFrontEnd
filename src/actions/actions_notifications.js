import { normalize } from 'normalizr'

import { notificationNormalizr, notificationsNormalizr } from '../models/normalizr'
import Api, { NOTIFICATIONS_URL } from '../services/api'
import { setFlashMessage } from './actions_flash_messages'

export const FETCH_NOTIFICATIONS = 'FETCH_NOTIFICATIONS'
export const FETCH_NOTIFICATIONS_SUCCEEDED = 'FETCH_NOTIFICATIONS_SUCCEEDED'
export const UPDATE_NOTIFICATION = 'UPDATE_NOTIFICATION'
export const UPDATE_NOTIFICATION_SUCCEEDED = 'UPDATE_NOTIFICATION_SUCCEEDED'

export const fetchNotifications = () => (dispatch) => {
  return Api.get(NOTIFICATIONS_URL)
     .then((request) => {
      const normalizeRequest = normalize(request.data, notificationsNormalizr)

      dispatch(fetchNotificationsSucceeded(normalizeRequest.entities.notifications))
   }).catch((error) => {
      console.error(error)

      if (error.response) {
        dispatch(setFlashMessage(error.response.data.error, 'error'))
      } else {
        dispatch(setFlashMessage("Error: Failed to retrieve notifications.. please try again later.", 'error'))
      }
   })
}

export const updateNotification = ({ notificationId, readAt }) => (dispatch) => {
  return Api.put(`${NOTIFICATIONS_URL}/${notificationId}`, { read_at: readAt })
    .then((request) => {
        const normalizeRequest = normalize(request.data, notificationNormalizr)

        dispatch(updateNotificationSucceeded(normalizeRequest.entities.notification))
    })
}

const fetchNotificationsSucceeded = (notifications) => ({
  type: FETCH_NOTIFICATIONS_SUCCEEDED,
  payload: {
    notifications,
  }
})

const updateNotificationSucceeded = (notification) => ({
  type: UPDATE_NOTIFICATION_SUCCEEDED,
  payload: {
    notification,
  }
})
