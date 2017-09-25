import axios from 'axios'
import { normalize } from 'normalizr'

import { headers, REVIEWS_URL } from '../api_url'
import { reviewNormalizr } from '../models/normalizr'
import { confirmPurchase } from './actions_contract'
import { CREATE_USERS } from './actions_users'
import { CREATE_ITEMS } from './actions_items'

import Auth from '../services/auth'

export const CREATE_REVIEW = 'CREATE_REVIEW'

export function createReview(purchase, params, provider) {
  const user_params = {
    buyer_wallet: Auth.wallet,
    seller_wallet: purchase.seller.wallet,
    rating: params.seller_rating,
    description: params.seller_review,
    item_id: purchase.item.id,
  }
  const item_params = {
    buyer_wallet: Auth.wallet,
    seller_wallet: purchase.seller.wallet,
    rating: params.item_rating,
    description: params.item_review,
    item_id: purchase.item.id,
  }

  return dispatch => {
    return dispatch(createUserReview(user_params)).then((userRequest) => {
      const normalizeRequest = normalize(userRequest.data, reviewNormalizr)
      dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
      dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
      dispatch({type: CREATE_REVIEW, payload: Object.assign({}, userRequest.data, { isItem: false })})
      return dispatch(createItemReview(item_params)).then((itemRequest) => {
        const normalizeRequest = normalize(itemRequest.data, reviewNormalizr)
        dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
        dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
        dispatch({type: CREATE_REVIEW, payload: Object.assign({}, itemRequest.data, { isItem: true })})
        dispatch(confirmPurchase(purchase.id,
                                 userRequest.data.id,
                                 itemRequest.data.id,
                                 user_params.rating,
                                 item_params.rating, provider))
      })
    })
  }
}

export function createUserReview(params) {
  return dispatch => {
    return axios.post(REVIEWS_URL, params, headers)
  }
}

export function createItemReview(params) {
  return dispatch => {
    return axios.post(REVIEWS_URL, params, headers)
  }
}

export function fetchOneReview(reviewId, isItem) {
  return dispatch => {
    return axios.get(`${REVIEWS_URL}/${reviewId}`)
                .then(request => {
                  const normalizeRequest = normalize(request.data, reviewNormalizr)
                  dispatch({type: CREATE_USERS, payload: normalizeRequest.entities.users})
                  dispatch({type: CREATE_ITEMS, payload: normalizeRequest.entities.items})
                  dispatch({type: CREATE_REVIEW, payload: Object.assign({}, request.data, { isItem: isItem })})
                })
  }

}
