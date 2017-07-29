import axios from 'axios'
import { normalize } from 'normalizr'

import { ACTIVITIES_URL } from '../api_url'
import { activitiesNormalizr } from '../models/normalizr'

import { CREATE_USERS } from './actions_users'
import { CREATE_ITEMS } from './actions_items'
import { CREATE_PURCHASES } from './actions_purchases'

export const CREATE_ACTIVITIES = 'CREATE_ACTIVITIES'

export function fetchAllActivities() {
  return dispatch => {
    axios.get(ACTIVITIES_URL)
         .then((request) => {
            const normalizeRequest = normalize(request.data, activitiesNormalizr)
            dispatch({ type: CREATE_USERS, payload: normalizeRequest.entities.users })
            dispatch({ type: CREATE_ITEMS, payload: normalizeRequest.entities.items })
            dispatch({ type: CREATE_PURCHASES, payload: normalizeRequest.entities.purchases })
            dispatch({ type: CREATE_ACTIVITIES, payload: normalizeRequest.entities.activities })
         })
  }
}

export function createLogActivity(category, purchaseId, itemId, amount, buyer, seller) {
  const activity_params = {
    category: category,
    purchase_id: purchaseId,
    item_id: itemId,
    amount: amount,
    buyer_address: buyer,
    seller_address: seller
  }
  return dispatch => {
    axios.post(ACTIVITIES_URL, activity_params)
  }
}
